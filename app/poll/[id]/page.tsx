"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import { Share2, Copy, Check, BarChart3, Users, Clock, ChevronLeft, Plus } from "lucide-react";
import { cn, generateFingerprint } from "@/lib/utils";
import { Poll } from "@/lib/models";

export default function PollPage() {
    const params = useParams();
    const id = params?.id as string;
    const [poll, setPoll] = useState<Poll | null>(null);
    const [hasVoted, setHasVoted] = useState(false);
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [isVoting, setIsVoting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);

    // Fetch poll data
    const fetchPoll = useCallback(async () => {
        try {
            const res = await fetch(`/api/polls/${id}`);
            const data = await res.json();
            if (data.error) {
                setError(data.error);
            } else {
                setPoll(data);
            }
        } catch (err) {
            console.error("Failed to fetch poll", err);
        }
    }, [id]);

    // Real-time updates via polling
    useEffect(() => {
        fetchPoll();
        const interval = setInterval(fetchPoll, 3000); // Polling every 3 seconds
        return () => clearInterval(interval);
    }, [fetchPoll]);

    // Check if user has already voted
    useEffect(() => {
        if (!id) return;
        const votedPolls = JSON.parse(localStorage.getItem("voted_polls") || "[]");
        if (votedPolls.includes(id)) {
            setHasVoted(true);
        }
    }, [id]);

    const handleVote = async () => {
        if (!selectedOption || isVoting || hasVoted) return;

        setIsVoting(true);
        setError(null);

        try {
            const fingerprint = generateFingerprint();
            const res = await fetch(`/api/polls/${id}/vote`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ optionId: selectedOption, fingerprint }),
            });

            const data = await res.json();
            if (res.ok) {
                setHasVoted(true);
                const votedPolls = JSON.parse(localStorage.getItem("voted_polls") || "[]");
                localStorage.setItem("voted_polls", JSON.stringify([...votedPolls, id]));
                fetchPoll();
            } else {
                setError(data.error || "Failed to submit vote");
                if (data.error?.includes("already voted")) {
                    setHasVoted(true);
                }
            }
        } catch (err) {
            setError("An error occurred. Please try again.");
        } finally {
            setIsVoting(false);
        }
    };

    const copyLink = () => {
        navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    if (error && !poll) {
        return (
            <div className="glass-card p-12 text-center space-y-6 max-w-md border-destructive/20">
                <div className="w-16 h-16 bg-destructive/10 text-destructive rounded-full flex items-center justify-center mx-auto">
                    <Clock className="w-8 h-8" />
                </div>
                <div className="space-y-2">
                    <h2 className="text-2xl font-bold tracking-tight">Poll Not Found</h2>
                    <p className="text-muted-foreground">{error}</p>
                </div>
                <button
                    onClick={() => window.location.href = "/"}
                    className="flex items-center justify-center space-x-2 w-full py-3 border border-border rounded-xl hover:bg-secondary transition-colors"
                >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Go back home</span>
                </button>
            </div>
        );
    }

    if (!poll) {
        return (
            <div className="flex flex-col items-center space-y-6 animate-in fade-in duration-700">
                <div className="relative">
                    <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <BarChart3 className="w-6 h-6 text-primary/40" />
                    </div>
                </div>
                <p className="text-muted-foreground font-medium animate-pulse">Synchronizing results...</p>
            </div>
        );
    }

    const totalVotes = poll.options.reduce((sum, opt) => sum + opt.votes, 0);
    const maxVotes = Math.max(...poll.options.map(o => o.votes));

    return (
        <div className="w-full max-w-2xl space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-1">
                <div className="space-y-3 flex-1">
                    <div className="flex items-center space-x-2 text-primary text-xs font-bold uppercase tracking-[0.2em]">
                        <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                        <span>Live Poll</span>
                    </div>
                    <h1 className="text-4xl font-extrabold tracking-tight leading-tight">{poll.question}</h1>
                </div>
                <button
                    onClick={copyLink}
                    className="flex items-center space-x-2 bg-secondary/80 hover:bg-secondary px-5 py-2.5 rounded-xl transition-all text-sm font-semibold border border-border backdrop-blur-sm self-start md:self-end active:scale-95"
                >
                    {copied ? <Check className="w-4 h-4 text-green-500" /> : <Share2 className="w-4 h-4" />}
                    <span>{copied ? "Copied Link" : "Share results"}</span>
                </button>
            </div>

            <div className="glass-card p-6 md:p-10 flex flex-col gap-10 border-primary/5">
                <div className="flex flex-col gap-5">
                    {poll.options.map((option) => {
                        const percentage = totalVotes > 0 ? Math.round((option.votes / totalVotes) * 100) : 0;
                        const isWinner = hasVoted && option.votes === maxVotes && maxVotes > 0;

                        return (
                            <div
                                key={option.id}
                                onClick={() => !hasVoted && setSelectedOption(option.id)}
                                className={cn(
                                    "relative group cursor-pointer overflow-hidden rounded-2xl border transition-all duration-500 ease-out",
                                    hasVoted ? "cursor-default" : "hover:border-primary/50 hover:bg-secondary/30",
                                    selectedOption === option.id ? "border-primary bg-primary/5 shadow-inner" : "border-border/50 bg-secondary/10",
                                    isWinner ? "ring-1 ring-primary/20 shadow-lg shadow-primary/5" : ""
                                )}
                            >
                                {/* Animated Progress Bar */}
                                {hasVoted && (
                                    <div
                                        className={cn(
                                            "absolute inset-0 bg-primary/10 transition-all duration-1000 ease-out z-0",
                                            isWinner ? "bg-primary/20" : ""
                                        )}
                                        style={{ width: `${percentage}%` }}
                                    />
                                )}

                                <div className="relative z-10 px-6 py-5 flex items-center justify-between">
                                    <div className="flex items-center space-x-4">
                                        {!hasVoted && (
                                            <div className={cn(
                                                "w-6 h-6 rounded-full border-2 transition-all flex items-center justify-center shrink-0",
                                                selectedOption === option.id ? "border-primary" : "border-muted-foreground/30 group-hover:border-muted-foreground/60"
                                            )}>
                                                {selectedOption === option.id && <div className="w-3 h-3 bg-primary rounded-full animate-in zoom-in duration-300" />}
                                            </div>
                                        )}
                                        <span className={cn(
                                            "font-semibold text-lg transition-colors",
                                            hasVoted ? "text-foreground" : "text-foreground/80 group-hover:text-foreground"
                                        )}>
                                            {option.text}
                                        </span>
                                    </div>

                                    {hasVoted && (
                                        <div className="flex flex-col items-end">
                                            <span className="text-xl font-black text-foreground tracking-tighter">
                                                {percentage}%
                                            </span>
                                            <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">
                                                {option.votes} {option.votes === 1 ? 'vote' : 'votes'}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {error && <p className="text-sm font-medium text-destructive bg-destructive/5 py-2 px-4 rounded-lg text-center animate-in shake duration-500">{error}</p>}

                {!hasVoted ? (
                    <div className="pt-2">
                        <button
                            onClick={handleVote}
                            disabled={!selectedOption || isVoting}
                            className="premium-button"
                        >
                            {isVoting ? "Submitting..." : "Cast Your Vote"}
                        </button>
                    </div>
                ) : (
                    <div className="pt-8 border-t border-border/50 flex flex-col sm:flex-row items-center justify-between gap-4 text-muted-foreground">
                        <div className="flex items-center space-x-5">
                            <div className="flex items-center space-x-2">
                                <div className="p-1.5 bg-secondary rounded-lg">
                                    <Users className="w-4 h-4" />
                                </div>
                                <span className="text-sm font-bold tracking-tight text-foreground/80">{totalVotes} Total Votes</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <div className="p-1.5 bg-secondary rounded-lg">
                                    <Clock className="w-4 h-4" />
                                </div>
                                <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground/60">Live Updates</span>
                            </div>
                        </div>
                        <Check className="w-5 h-5 text-primary opacity-50 hidden sm:block" />
                    </div>
                )}
            </div>

            <div className="text-center pt-4">
                <button
                    onClick={() => window.location.href = "/"}
                    className="group inline-flex items-center space-x-2 text-sm font-bold text-muted-foreground hover:text-foreground transition-all"
                >
                    <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" />
                    <span>Start a new poll</span>
                </button>
            </div>
        </div>
    );
}

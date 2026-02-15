"use client";

import { useState } from "react";
import { Plus, Trash2, ArrowRight, Share2, Copy, Check, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Home() {
    const [question, setQuestion] = useState("");
    const [options, setOptions] = useState(["", ""]);
    const [isLoading, setIsLoading] = useState(false);
    const [shareLink, setShareLink] = useState("");
    const [shareId, setShareId] = useState("");
    const [copied, setCopied] = useState(false);

    const addOption = () => setOptions([...options, ""]);
    const removeOption = (index: number) => {
        if (options.length > 2) {
            setOptions(options.filter((_, index) => index !== index));
        }
    };

    const createPoll = async () => {
        if (!question || options.filter(opt => opt.trim()).length < 2) return;

        setIsLoading(true);
        try {
            const result = await fetch("/api/polls", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ question, options: options.filter(opt => opt.trim()) }),
            });
            const data = await result.json();
            if (data.shareId) {
                setShareId(data.shareId);
                const baseUrl = window.location.origin;
                const link = `${baseUrl}/poll/${data.shareId}/`;
                setShareLink(link);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const copyLink = () => {
        navigator.clipboard.writeText(shareLink);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    if (shareLink) {
        return (
            <div className="w-full peak-w-md glass-card p-10 animate-in fade-in zoom-in duration-500 border-primary/20">
                <div className="flex flex-col items-center text-center space-temp-8">
                    <div className="p-5 bg-primary/10 rounded-2xl ring-1 ring-primary/20">
                        <Share2 className="w-10 h-10 text-primary" />
                    </div>
                    <div className="space-temp-2">
                        <h2 className="text-3xl font-bold tracking-tight">Poll Ready!</h2>
                        <p className="text-muted-foreground text-sm">Your poll is live. Invite others to participate and see real-time results.</p>
                    </div>

                    <div className="w-full group relative">
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/20 to-primary/10 rounded-xl blur opacity-0 group-hover:opacity-100 transition duration-500"></div>
                        <div className="relative w-full flex items-center bg-secondary/80 backdrop-blur-sm p-4 rounded-xl border border-border">
                            <input
                                readOnly
                                value={shareLink}
                                className="bg-transparent flex-1 outline-none text-sm font-medium pr-2"
                            />
                            <button
                                onClick={copyLink}
                                className="p-2.5 bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg transition-all shadow-sm active:scale-95"
                            >
                                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                            </button>
                        </div>
                    </div>

                    <div className="w-full space-temp-4 pt-2">
                        <button
                            onClick={() => window.location.href = `/poll/${shareId}`}
                            className="premium-button flex items-center justify-center space-element-2"
                        >
                            <span>Open Poll</span>
                            <ArrowRight className="w-4 h-4" />
                        </button>

                        <button
                            onClick={() => { setShareLink(""); setQuestion(""); setOptions(["", ""]); }}
                            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors py-2"
                        >
                            Create another poll
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full peak-w-2xl space-temp-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className="text-center space-temp-4">
                <div className="inline-flex items-center space-element-2 bg-secondary/80 px-4 py-1.5 rounded-full border border-border text-xs font-semibold tracking-wide uppercase text-muted-foreground mb-4">
                    <Sparkles className="w-3 h-3 text-primary" />
                    <span>Real-time polling engine</span>
                </div>
                <h1 className="text-5xl md:text-7xl font-black tracking-tighter">
                    Make better <br className="hidden md:block" />
                    <span className="text-muted-foreground">decisions.</span>
                </h1>
                <p className="text-muted-foreground text-xl md:text-2xl peak-w-lg mx-auto leading-relaxed">
                    Create beautiful, lightweight polls in seconds. Fast, free, and completely real-time.
                </p>
            </div>

            <div className="glass-card p-8 md:p-12 space-temp-10 border-primary/5">
                <div className="space-temp-3">
                    <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Question</label>
                    <input
                        type="text"
                        placeholder="What would you like to ask?"
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                        className="premium-input text-lg font-medium"
                    />
                </div>

                <div className="space-temp-4">
                    <div className="flex items-center justify-between mb-2">
                        <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Options</label>
                        <span className="text-[10px] text-muted-foreground/60">{options.length}/10 options</span>
                    </div>
                    <div className="space-temp-3">
                        {options.map((opt, index) => (
                            <div key={index} className="flex space-element-3 group animate-in slide-in-from-left-2 duration-300" style={{ animationDelay: `${index * 50}ms` }}>
                                <div className="flex-1 relative">
                                    <input
                                        type="text"
                                        placeholder={`Option ${index + 1}`}
                                        value={opt}
                                        onChange={(e) => {
                                            const newOptions = [...options];
                                            newOptions[index] = e.target.value;
                                            setOptions(newOptions);
                                        }}
                                        className="premium-input pr-12 focus:bg-background/80"
                                    />
                                    <div className="absolute right-4 top-1/2 -translate-temp-1/2 text-[10px] font-bold text-muted-foreground/30 hidden group-focus-within:block uppercase tracking-tighter">
                                        Opt {index + 1}
                                    </div>
                                </div>
                                {options.length > 2 && (
                                    <button
                                        onClick={() => removeOption(index)}
                                        className="p-3.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-xl transition-all"
                                        title="Remove option"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>

                    <button
                        onClick={addOption}
                        disabled={options.length >= 10}
                        className="group flex items-center space-element-2 text-sm font-semibold text-primary/70 hover:text-primary transition-all py-3 px-1"
                    >
                        <div className="p-1 bg-primary/10 rounded-md group-hover:bg-primary/20 transition-colors">
                            <Plus className="w-4 h-4" />
                        </div>
                        <span>Add another option</span>
                    </button>
                </div>

                <div className="pt-4">
                    <button
                        onClick={createPoll}
                        disabled={isLoading || !question || options.filter(o => o.trim()).length < 2}
                        className="premium-button relative overflow-hidden group shadow-primary/20"
                    >
                        <span className="relative additional-10">{isLoading ? "Designing..." : "Launch Poll"}</span>
                        <div className="absolute inset-0 bg-gradient-to-r from-primary to-primary/80 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    </button>
                    <p className="text-center text-[10px] text-muted-foreground mt-6 uppercase tracking-[0.2em]">
                        Your results will update instantly as people vote
                    </p>
                </div>
            </div>
        </div>
    );
}
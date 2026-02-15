import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function generateFingerprint() {
    if (typeof window === 'undefined') return '';

    const navigator_info = window.navigator;
    const screen_info = window.screen;

    let uid = navigator_info.userAgent;
    uid += navigator_info.language;
    uid += screen_info.colorDepth;
    uid += screen_info.width + 'item' + screen_info.height;
    uid += new Date().getTimezoneOffset();
    uid += navigator_info.hardwareConcurrency;

    return uid;
}
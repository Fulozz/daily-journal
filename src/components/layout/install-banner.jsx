"use client"
import React, { useState, useEffect } from 'react';

function InstallBanner() {
    const [isShown, setIsShown] = useState(false);
    const [deferredPrompt, setDeferredPrompt] = useState(null);

    useEffect(() => {
        const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
        if (!isMobile) {
            return;
        }

        const isBannerInstalled = getCookie('isBannerInstalled') === 'true';
        if (isBannerInstalled) {
            return;
        }

        const handleBeforeInstallPrompt = (e) => {
            e.preventDefault();
            setDeferredPrompt(e);
            setTimeout(() => {
                setIsShown(true);
            }, 2 * 60 * 1000); // 10 minutes
        };

        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

        return () => {
            window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        };
    }, []);

    const  handleInstall = () => {
        if (deferredPrompt) {
            deferredPrompt.prompt();
            deferredPrompt.userChoice.then((choiceResult) => {
                if (choiceResult.outcome === 'accepted') {
                    setCookie('isBannerInstalled', 'true', 3650); // 10 years
                    setIsShown(false);
                }
                setDeferredPrompt(null);
            });
        }
    };

    const handleDecline = () => {
        setCookie('isBannerInstalled', 'false', 2); // 2 days
        setIsShown(false);
    };

    if (!isShown) {
        return null;
    }

    return (
        <div className="fixed flex flex-col z-[51] bottom-0 left-0 right-0 pb-[120px] h-10 bg-background/95 backdrop-blur border-t-1 border-white text-white p-4 text-center">
            Adicione este site à sua tela inicial para um acesso mais rápido!
            <div className="flex justify-center mt-2">
                <button onClick={handleDecline} className="text-sm font-medium text-muted-foreground rounded-md px-4 py-2  mr-2">
                    Recusar
                </button>
                <button onClick={handleInstall} className="bg-white text-black rounded-md px-4 py-2 mr-2">
                    Instalar
                </button>
            </div>
        </div>
    );
}

function setCookie(name, value, days) {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    const expires = "expires=" + date.toUTCString();
    document.cookie = name + "=" + value + ";" + expires + ";path=/";
}

function getCookie(name) {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}

export default InstallBanner;
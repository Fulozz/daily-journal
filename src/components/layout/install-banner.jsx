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

        const isBannerInstalled = localStorage.getItem('isBannerInstalled') === 'true';
        setIsShown(!isBannerInstalled);

        const handleBeforeInstallPrompt = (e) => {
            e.preventDefault();
            setDeferredPrompt(e);
            setIsShown(true);
        };

        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

        return () => {
            window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        };
    }, []);

    const handleInstall = () => {
        if (deferredPrompt) {
            deferredPrompt.prompt();
            deferredPrompt.userChoice.then((choiceResult) => {
                if (choiceResult.outcome === 'accepted') {
                    localStorage.setItem('isBannerInstalled', 'true');
                    setIsShown(false);
                }
                setDeferredPrompt(null);
            });
        }
    };

    const handleDecline = () => {
        localStorage.setItem('isBannerInstalled', 'true');
        setIsShown(false);
    };

    if (!isShown) {
        return null;
    }

    return (
        <div className="fixed flex flex-col bottom-0 left-0 right-0 pb-[170px] h-10 bg-blue-500 text-white p-4 text-center">
            Adicione este site à sua tela inicial para um acesso mais rápido!
            <div className="flex justify-center mt-2">
                <button onClick={handleInstall} className="bg-white text-blue-500 rounded-md px-4 py-2 mr-2">
                    Instalar
                </button>
                <button onClick={handleDecline} className="bg-white text-blue-500 rounded-md px-4 py-2">
                    Recusar
                </button>
            </div>
        </div>
    );
}

export default InstallBanner;
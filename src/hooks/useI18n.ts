import { useState, useEffect } from 'react';
import { I18n } from '@/services/I18nService';
import type { LangCode } from '@/services/I18nService';

export function useI18n(): [LangCode, (lang: LangCode) => void] {
    const [lang, setLang] = useState<LangCode>(I18n.getLang());

    useEffect(() => {
        const unsubscribe = I18n.subscribe((newLang) => {
            setLang(newLang);
        });
        return unsubscribe;
    }, []);

    const changeLang = (newLang: LangCode) => {
        I18n.setLang(newLang);
    };

    return [lang, changeLang];
}
import enUS from '../../data/locales/en_us.json';
import zhCN from '../../data/locales/zh_cn.json';
import zhHK from '../../data/locales/zh_hk.json';

export type LangCode = 'en_us' | 'zh_cn' | 'zh_hk';

const locales: Record<LangCode, Record<string, string>> = {
    'en_us': enUS,
    'zh_cn': zhCN,
    'zh_hk': zhHK,
};

type LangChangeListener = (lang: LangCode) => void;

export class I18n {
    private static currentLang: LangCode = 'en_us';
    private static listeners: Set<LangChangeListener> = new Set();

    static subscribe(listener: LangChangeListener): () => void {
        this.listeners.add(listener);
        return () => {
            this.listeners.delete(listener);
        };
    }

    static getLang(): LangCode {
        return this.currentLang;
    }

    static setLang(langCode: LangCode) {
        if (this.currentLang !== langCode) {
            this.currentLang = langCode;
            this.listeners.forEach(listener => listener(langCode));
        }
    }

    static get(key: string | undefined, defaultValue?: string): string {
        const langCode = this.currentLang;
        if (!key) {
            return defaultValue ?? '';
        }

        const locale = locales[langCode];
        if (locale && locale[key] !== undefined) {
            return locale[key];
        }

        if (langCode !== 'en_us') {
            const enUsLocale = locales['en_us'];
            if (enUsLocale && enUsLocale[key] !== undefined) {
                return enUsLocale[key];
            }
        }

        console.warn(`[I18n] Missing translation for key: "${key}" in language: ${langCode} and fallback en_us`);
        return defaultValue !== undefined ? defaultValue : key;
    }
}

const setCaptionsLanguage = (unformattedLang) => {

    const languageOptions = { en: 'english', es: 'spanish', fr: 'french', it: 'italian', pt: 'portuguese' };

    const formattedLang = unformattedLang.split('-')[0];

    return languageOptions[formattedLang];

};

module.exports = setCaptionsLanguage;
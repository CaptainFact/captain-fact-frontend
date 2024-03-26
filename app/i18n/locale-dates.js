import datelocaleAR from 'date-fns/locale/ar-MA'
import datelocaleEN from 'date-fns/locale/en-US'
import datelocaleEO from 'date-fns/locale/eo'
import datelocaleES from 'date-fns/locale/es'
import dateLocaleFR from 'date-fns/locale/fr'
import datelocalePTBR from 'date-fns/locale/pt-BR'
import dateLocaleRU from 'date-fns/locale/ru'

// Add default formats for dates
dateLocaleFR.defaultDateTimeFormat = "'Le' d MMM yyyy 'à' H:mm"
dateLocaleFR.defaultDateFormat = "'Le' d MMM yyyy"
datelocaleEN.defaultDateTimeFormat = "d MMM yyyy 'at' H:mm"
datelocaleEN.defaultDateFormat = 'd MMM yyyy'
datelocaleEO.defaultDateTimeFormat = 'P'
datelocaleEO.defaultDateFormat = 'Pp'
datelocaleES.defaultDateTimeFormat = "'El' d MMM yyyy 'a las' H:mm"
datelocaleES.defaultDateFormat = "'El' d MMM yyyy"
datelocaleAR.defaultDateTimeFormat = 'P'
datelocaleAR.defaultDateFormat = 'Pp'
datelocalePTBR.defaultDateFormat = 'd MMM yyyy'
datelocalePTBR.defaultDateTimeFormat = "d MMM yyyy 'às' H:mm"
dateLocaleRU.defaultDateTimeFormat = 'P'

export const LocaleDates = {
  fr: dateLocaleFR,
  en: datelocaleEN,
  ar: datelocaleAR,
  es: datelocaleES,
  eo: datelocaleEO,
  pt_BR: datelocalePTBR,
  ru: dateLocaleRU,
}

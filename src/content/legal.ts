/**
 * Pages légales.
 *
 * À COMPLÉTER avant la mise en production : raison sociale, forme juridique,
 * capital, SIREN/SIRET, numéro de TVA, adresse du siège, directeur de la
 * publication. Les champs entre crochets sont des emplacements à remplir.
 */

export const legalNotice = {
  fr: {
    title: "Mentions légales",
    updated: "Dernière mise à jour : octobre 2026",
    body: `## Éditeur du site

Le site **kalimera.agency** est édité par [RAISON SOCIALE], [FORME JURIDIQUE] au capital de [MONTANT] €.

- Siège social : [ADRESSE COMPLÈTE]
- SIREN : [NUMÉRO] — RCS de [VILLE]
- Numéro de TVA intracommunautaire : [FR00000000000]
- Directeur de la publication : [NOM]
- Contact : hello@kalimera.agency

## Hébergement

Le site est hébergé par Vercel Inc., 340 S Lemon Ave #4133, Walnut, CA 91789, États-Unis — vercel.com.

Les données de la base sont hébergées par Railway Corp., au sein de l'Union européenne.

## Propriété intellectuelle

L'ensemble des contenus présents sur ce site — textes, images, code, identité visuelle — est la propriété de [RAISON SOCIALE], sauf mention contraire. Toute reproduction, même partielle, est soumise à autorisation écrite préalable.

Les marques et logos des clients cités restent la propriété de leurs titulaires respectifs et sont affichés avec leur accord.

## Responsabilité

Nous nous efforçons de maintenir les informations de ce site exactes et à jour. Des erreurs peuvent cependant subsister ; elles ne sauraient engager notre responsabilité. Les liens vers des sites tiers sont fournis à titre indicatif et n'impliquent aucune approbation de leur contenu.

## Droit applicable

Les présentes mentions sont régies par le droit français. En cas de litige, et à défaut de résolution amiable, les tribunaux de [VILLE] sont seuls compétents.`,
  },
  en: {
    title: "Legal notice",
    updated: "Last updated: October 2026",
    body: `## Site publisher

The website **kalimera.agency** is published by [COMPANY NAME], a [LEGAL FORM] with share capital of €[AMOUNT].

- Registered office: [FULL ADDRESS]
- Company number: [NUMBER] — registered in [CITY]
- VAT number: [FR00000000000]
- Publication director: [NAME]
- Contact: hello@kalimera.agency

## Hosting

The site is hosted by Vercel Inc., 340 S Lemon Ave #4133, Walnut, CA 91789, United States — vercel.com.

Database data is hosted by Railway Corp., within the European Union.

## Intellectual property

All content on this site — text, images, code, visual identity — is the property of [COMPANY NAME] unless otherwise stated. Any reproduction, even partial, requires prior written permission.

Client trademarks and logos shown remain the property of their respective owners and are displayed with their consent.

## Liability

We make every effort to keep the information on this site accurate and current. Errors may nonetheless remain, and cannot engage our liability. Links to third-party sites are provided for information and imply no endorsement of their content.

## Governing law

This notice is governed by French law. In the event of a dispute that cannot be resolved amicably, the courts of [CITY] shall have sole jurisdiction.`,
  },
  es: {
    title: "Aviso legal",
    updated: "Última actualización: octubre de 2026",
    body: `## Editor del sitio

El sitio **kalimera.agency** está editado por [RAZÓN SOCIAL], [FORMA JURÍDICA] con un capital de [IMPORTE] €.

- Domicilio social: [DIRECCIÓN COMPLETA]
- Número de empresa: [NÚMERO] — Registro Mercantil de [CIUDAD]
- Número de IVA intracomunitario: [FR00000000000]
- Director de publicación: [NOMBRE]
- Contacto: hello@kalimera.agency

## Alojamiento

El sitio está alojado por Vercel Inc., 340 S Lemon Ave #4133, Walnut, CA 91789, Estados Unidos — vercel.com.

Los datos de la base están alojados por Railway Corp., dentro de la Unión Europea.

## Propiedad intelectual

Todo el contenido de este sitio — textos, imágenes, código, identidad visual — es propiedad de [RAZÓN SOCIAL], salvo indicación contraria. Cualquier reproducción, incluso parcial, requiere autorización escrita previa.

Las marcas y logotipos de los clientes citados siguen siendo propiedad de sus respectivos titulares y se muestran con su consentimiento.

## Responsabilidad

Nos esforzamos por mantener la información de este sitio exacta y actualizada. No obstante, pueden subsistir errores, que no comprometen nuestra responsabilidad. Los enlaces a sitios de terceros se facilitan a título informativo y no implican aprobación alguna de su contenido.

## Ley aplicable

El presente aviso se rige por la legislación francesa. En caso de litigio, y a falta de resolución amistosa, serán competentes exclusivamente los tribunales de [CIUDAD].`,
  },
} as const;

export const privacyPolicy = {
  fr: {
    title: "Politique de confidentialité",
    updated: "Dernière mise à jour : octobre 2026",
    body: `## Ce que nous collectons

Nous ne collectons que les données que vous nous transmettez volontairement via le formulaire de contact : nom, adresse email, et si vous les renseignez, société, téléphone, budget envisagé et description de votre projet.

Ce site n'utilise **aucun cookie publicitaire ni traceur tiers**. Aucun profilage n'est effectué.

## Pourquoi nous les collectons

Ces données servent uniquement à répondre à votre demande et, le cas échéant, à établir une proposition commerciale. La base légale est votre consentement, recueilli explicitement lors de l'envoi du formulaire.

## Combien de temps nous les conservons

- Demandes sans suite commerciale : **12 mois** à compter du dernier échange
- Demandes ayant donné lieu à un devis : **3 ans** à compter du dernier échange
- Documents comptables liés à un contrat : **10 ans**, conformément aux obligations légales

## Qui y a accès

Vos données sont accessibles à la seule équipe de Kalimera. Elles sont traitées par les sous-traitants techniques suivants :

- **Railway** — hébergement de la base de données, au sein de l'Union européenne
- **Vercel** — hébergement du site et exécution des fonctions serveur
- **Resend** — acheminement des emails de notification et d'accusé de réception
- **Cloudinary** — stockage des images publiées sur le site

Aucune donnée n'est vendue, louée ni transmise à des fins commerciales.

## Vos droits

Conformément au RGPD, vous disposez d'un droit d'accès, de rectification, d'effacement, de limitation, d'opposition et de portabilité de vos données. Pour l'exercer, écrivez à **hello@kalimera.agency** : nous répondons sous 30 jours.

Vous pouvez également introduire une réclamation auprès de la CNIL (cnil.fr).

## Sécurité

Les échanges avec ce site sont chiffrés (HTTPS). L'accès à l'administration est protégé par mot de passe, et les mots de passe sont stockés sous forme de condensats irréversibles.`,
  },
  en: {
    title: "Privacy policy",
    updated: "Last updated: October 2026",
    body: `## What we collect

We only collect the data you voluntarily submit through the contact form: name, email address, and — if you provide them — company, phone number, intended budget and a description of your project.

This site uses **no advertising cookies and no third-party trackers**. No profiling takes place.

## Why we collect it

This data is used solely to answer your enquiry and, where relevant, to prepare a proposal. The legal basis is your consent, given explicitly when you submit the form.

## How long we keep it

- Enquiries with no commercial follow-up: **12 months** from the last exchange
- Enquiries that led to a quote: **3 years** from the last exchange
- Accounting records tied to a contract: **10 years**, as required by law

## Who has access

Your data is accessible only to the Kalimera team. It is processed by the following technical subprocessors:

- **Railway** — database hosting, within the European Union
- **Vercel** — site hosting and server function execution
- **Resend** — delivery of notification and acknowledgement emails
- **Cloudinary** — storage of images published on the site

No data is sold, rented or passed on for commercial purposes.

## Your rights

Under the GDPR you have the right to access, rectify, erase, restrict, object to and port your data. To exercise these rights, write to **hello@kalimera.agency**: we respond within 30 days.

You may also lodge a complaint with the French data protection authority, the CNIL (cnil.fr).

## Security

Traffic to this site is encrypted (HTTPS). Administrative access is password-protected, and passwords are stored as irreversible hashes.`,
  },
  es: {
    title: "Política de privacidad",
    updated: "Última actualización: octubre de 2026",
    body: `## Qué recogemos

Solo recogemos los datos que nos facilitas voluntariamente a través del formulario de contacto: nombre, dirección de email y, si los indicas, empresa, teléfono, presupuesto previsto y descripción de tu proyecto.

Este sitio no utiliza **ninguna cookie publicitaria ni rastreador de terceros**. No se realiza ningún perfilado.

## Por qué los recogemos

Estos datos se utilizan únicamente para responder a tu consulta y, en su caso, para elaborar una propuesta comercial. La base legal es tu consentimiento, recogido explícitamente al enviar el formulario.

## Cuánto tiempo los conservamos

- Consultas sin continuidad comercial: **12 meses** desde el último contacto
- Consultas que dieron lugar a un presupuesto: **3 años** desde el último contacto
- Documentos contables vinculados a un contrato: **10 años**, según las obligaciones legales

## Quién tiene acceso

Tus datos son accesibles únicamente para el equipo de Kalimera. Son tratados por los siguientes encargados técnicos:

- **Railway** — alojamiento de la base de datos, dentro de la Unión Europea
- **Vercel** — alojamiento del sitio y ejecución de las funciones de servidor
- **Resend** — envío de los emails de notificación y acuse de recibo
- **Cloudinary** — almacenamiento de las imágenes publicadas en el sitio

Ningún dato se vende, alquila ni cede con fines comerciales.

## Tus derechos

Conforme al RGPD, tienes derecho de acceso, rectificación, supresión, limitación, oposición y portabilidad de tus datos. Para ejercerlos, escribe a **hello@kalimera.agency**: respondemos en un plazo de 30 días.

También puedes presentar una reclamación ante la autoridad de control competente.

## Seguridad

Las comunicaciones con este sitio están cifradas (HTTPS). El acceso a la administración está protegido por contraseña, y las contraseñas se almacenan como resúmenes irreversibles.`,
  },
} as const;

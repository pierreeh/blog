import Document, { Html, Head, Main, NextScript } from "next/document"
import { ServerStyleSheet } from "styled-components"

export default class Blog extends Document {
  static async getInitialProps(ctx) {
    const sheet = new ServerStyleSheet()
    const originalRenderPage = ctx.renderPage

    try {
      ctx.renderPage = () =>
      originalRenderPage({enhanceApp: App => props => sheet.collectStyles(<App {...props} />)})

      const initialProps = await Document.getInitialProps(ctx)
      return {
        ...initialProps,
        styles: (
          <>
            {initialProps.styles}
            {sheet.getStyleElement()}
          </>
        )
      }
    } finally {
      sheet.seal()
    }
  }

  render() {
    return (
      <Html>
        <Head>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin />
          <style
            data-href="https://fonts.googleapis.com/css2?family=Mulish:wght@400;700&display=swap"
            dangerouslySetInnerHTML={{__html:`
              /* cyrillic-ext */
              @font-face {
                font-family: 'Mulish';
                font-style: normal;
                font-weight: 400;
                font-display: swap;
                src: url(https://fonts.gstatic.com/s/mulish/v12/1Ptvg83HX_SGhgqk0gotYKNnBcif.woff2) format('woff2');
                unicode-range: U+0460-052F, U+1C80-1C88, U+20B4, U+2DE0-2DFF, U+A640-A69F, U+FE2E-FE2F;
              }
              /* cyrillic */
              @font-face {
                font-family: 'Mulish';
                font-style: normal;
                font-weight: 400;
                font-display: swap;
                src: url(https://fonts.gstatic.com/s/mulish/v12/1Ptvg83HX_SGhgqk2wotYKNnBcif.woff2) format('woff2');
                unicode-range: U+0301, U+0400-045F, U+0490-0491, U+04B0-04B1, U+2116;
              }
              /* vietnamese */
              @font-face {
                font-family: 'Mulish';
                font-style: normal;
                font-weight: 400;
                font-display: swap;
                src: url(https://fonts.gstatic.com/s/mulish/v12/1Ptvg83HX_SGhgqk0AotYKNnBcif.woff2) format('woff2');
                unicode-range: U+0102-0103, U+0110-0111, U+0128-0129, U+0168-0169, U+01A0-01A1, U+01AF-01B0, U+1EA0-1EF9, U+20AB;
              }
              /* latin-ext */
              @font-face {
                font-family: 'Mulish';
                font-style: normal;
                font-weight: 400;
                font-display: swap;
                src: url(https://fonts.gstatic.com/s/mulish/v12/1Ptvg83HX_SGhgqk0QotYKNnBcif.woff2) format('woff2');
                unicode-range: U+0100-024F, U+0259, U+1E00-1EFF, U+2020, U+20A0-20AB, U+20AD-20CF, U+2113, U+2C60-2C7F, U+A720-A7FF;
              }
              /* latin */
              @font-face {
                font-family: 'Mulish';
                font-style: normal;
                font-weight: 400;
                font-display: swap;
                src: url(https://fonts.gstatic.com/s/mulish/v12/1Ptvg83HX_SGhgqk3wotYKNnBQ.woff2) format('woff2');
                unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
              }
              /* cyrillic-ext */
              @font-face {
                font-family: 'Mulish';
                font-style: normal;
                font-weight: 700;
                font-display: swap;
                src: url(https://fonts.gstatic.com/s/mulish/v12/1Ptvg83HX_SGhgqk0gotYKNnBcif.woff2) format('woff2');
                unicode-range: U+0460-052F, U+1C80-1C88, U+20B4, U+2DE0-2DFF, U+A640-A69F, U+FE2E-FE2F;
              }
              /* cyrillic */
              @font-face {
                font-family: 'Mulish';
                font-style: normal;
                font-weight: 700;
                font-display: swap;
                src: url(https://fonts.gstatic.com/s/mulish/v12/1Ptvg83HX_SGhgqk2wotYKNnBcif.woff2) format('woff2');
                unicode-range: U+0301, U+0400-045F, U+0490-0491, U+04B0-04B1, U+2116;
              }
              /* vietnamese */
              @font-face {
                font-family: 'Mulish';
                font-style: normal;
                font-weight: 700;
                font-display: swap;
                src: url(https://fonts.gstatic.com/s/mulish/v12/1Ptvg83HX_SGhgqk0AotYKNnBcif.woff2) format('woff2');
                unicode-range: U+0102-0103, U+0110-0111, U+0128-0129, U+0168-0169, U+01A0-01A1, U+01AF-01B0, U+1EA0-1EF9, U+20AB;
              }
              /* latin-ext */
              @font-face {
                font-family: 'Mulish';
                font-style: normal;
                font-weight: 700;
                font-display: swap;
                src: url(https://fonts.gstatic.com/s/mulish/v12/1Ptvg83HX_SGhgqk0QotYKNnBcif.woff2) format('woff2');
                unicode-range: U+0100-024F, U+0259, U+1E00-1EFF, U+2020, U+20A0-20AB, U+20AD-20CF, U+2113, U+2C60-2C7F, U+A720-A7FF;
              }
              /* latin */
              @font-face {
                font-family: 'Mulish';
                font-style: normal;
                font-weight: 700;
                font-display: swap;
                src: url(https://fonts.gstatic.com/s/mulish/v12/1Ptvg83HX_SGhgqk3wotYKNnBQ.woff2) format('woff2');
                unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
              }
            `}}
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

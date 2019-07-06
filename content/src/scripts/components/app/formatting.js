
  const extractReadingContentFromArticle = (articleTextString) => {
    // const punctuationRegExp = /[.,\/!\^\*;:\`)]/g;
    const punctuationRegExp = /[.?!)\]]/g;
    const onlyNumbersRegExp = /\d+/g;
    const newLinesRegExp = /\n/g;

    const articleText = articleTextString.slice(0);
    const articleTextArray = articleText.slice(0).split(newLinesRegExp);
    const { textContent } = (document.getElementsByTagName('h2')[0] || {});

    if (textContent && typeof textContent === 'string') {
      const headerText = textContent.slice(0).toLowerCase();
      const headerIndex = articleTextArray.findIndex((text) => text.toLowerCase() === headerText);
      articleTextArray[headerIndex] = textContent + '.';
    }

    let cleanedUpArticleTextArray = [];
    let removeUnpunctuatedLines = false;

    for (let len = articleTextArray.length, i = 0; i < len; i++) {
      const articleLine = articleTextArray[i].slice(0).trim();
      const containsText = articleLine.trim().length > 0;
      const numberAtEnd = isNaN(+(articleLine[articleLine.length - 1])) === false;
      const numbersTest = articleLine.slice(0);
      const lineContainsOnlyNumbers = !numbersTest.replace(onlyNumbersRegExp, '');

      const containsPunctuation = punctuationRegExp.test(articleLine);
      if (!containsPunctuation && removeUnpunctuatedLines) {
        continue;
      }

      if (!containsPunctuation) {
        const nextLineIndex2 = i + 1;
        const nextLineIndex3 = i + 2;

        const articleLineNext2 = (articleTextArray[nextLineIndex2] || '').slice(0).trim();
        if (!articleLineNext2) {
          continue;
        }

        const articleLineNext3 = (articleTextArray[nextLineIndex3] || '').slice(0).trim();
        if (!articleLineNext3) {
          continue;
        }

        const containsPunctuation2 = punctuationRegExp.test(articleLineNext2);
        const containsPunctuation3 = punctuationRegExp.test(articleLineNext3);

        if (!containsPunctuation2 && !containsPunctuation3) {
          removeUnpunctuatedLines = true;
          continue;
        }
        // TODO: continue might need to go back here
      }
      if ((containsText || numberAtEnd) && lineContainsOnlyNumbers !== true) {
        cleanedUpArticleTextArray.push(articleLine);
      }
    }
    return cleanedUpArticleTextArray.slice(0).join('\n').trim();
  };

  export const formatWebPageText = () => {
    const webPageText = document.getElementsByTagName('body')[0].outerText
      .replace(/<img>.*<\/img>|.*<img>/, '')
      .replace(/<[^>]+>/g, '')
      .replace(/http:\/\/www\.(.*?)\/.*/ig, '$1')
      .replace(/https:\/\/www\.(.*?)\/.*/ig, '$1')
      .replace(/http:\/\/(.*?)\/.*/ig, '$1')
      .replace(/https:\/\/(.*?)\/.*/ig, '$1')
      .replace(/www\.(.*?)\/.*/ig, '$1')
      .replace(/( )+/g, ' ')
     

      // &quot;words&quot; 'more words&quot;

    const { textContent: articleHeader } = (document.getElementsByTagName('h1')[0] || {});
    let updatedArticleText;
    let formattedArticle;
    const articleText = webPageText.slice(0);

    if (articleHeader && webPageText) {
      const validArticleHeader = typeof articleHeader === 'string' && articleHeader.length > 0;
      const validArticleText = typeof webPageText === 'string' && webPageText.length > 0;

      if (validArticleHeader && validArticleText) {
        const articleHeaderIndex = articleText.slice(0).toLowerCase().indexOf(articleHeader.slice().toLowerCase());
        const articleWithEverythingBeforeHeaderRemoved = articleText.slice(articleHeaderIndex + articleHeader.length + 1);

        formattedArticle = extractReadingContentFromArticle(articleWithEverythingBeforeHeaderRemoved);
        updatedArticleText = `${articleHeader}\n${formattedArticle}`;

      } else if (!validArticleHeader && validArticleText) {
        // no headings -> just format everything
        formattedArticle = extractReadingContentFromArticle(articleText);
        updatedArticleText = formattedArticle;
      } else {
        // TODO: notify user there was an error :/
        // TODO -- maybe try again - could be some issue with the site loading
      }
    } else if (webPageText) {
      // no headings -> just format everything
      formattedArticle = extractReadingContentFromArticle(articleText);
      updatedArticleText = formattedArticle;
    } else {
      // TODO: notify user there was an error :/
      // TODO -- maybe try again - could be some issue with the site loading
    }
    return updatedArticleText;
  };

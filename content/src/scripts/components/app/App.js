import createCachedSelector from "re-reselect";
import React, { PureComponent } from "react";
import ReactToPrint from 'react-to-print';
import { connect } from "react-redux";
import { Button, Card, Checkbox, Dimmer, Dropdown, Grid, Icon, Label, Menu, Popup, Image } from "semantic-ui-react";
import LightningArticleText from "../LightningArticleText";
import LightningText from "../LightningText";
import { GRADIENT_HSL_VALUES } from "./GRADIENT_HSL_VALUES";
import { formatWebPageText } from "./formatting";
import { hexToHSL, setLineArrayWithHslValues } from "./hsl"
import WebFont from 'webfontloader';

let formattedText = "";
let formattedHTML = "";
let userText;
let paragraphCount;
let formattedWebArticleContent = "";
let getVisibleLightningTextReaderStateSelector;

class App extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      display: true,
      settingsMenu: false,
      fontFamily: "garamond",
      fontSize: 1.6,
      fontColour: "#ffffff",
      lineHeight: 1.45,
      charactersPerLine: 65,
      lightningSpeed: 1.7,
      backgroundColour: "#00303F",
      lineGradientEnabled: true,
      formatMenuInput: "",
      lineGradientHslValue: GRADIENT_HSL_VALUES.default,
      lightningTextEnabled: false,
      lightningPlay: false,
      pageOpacity: 0,
      backdropColour: '#aab0c0'
    };

    this.handleFormatInput = this.handleFormatInput.bind(this);
    this.removeTextItemOnClickHandler = this.removeTextItemOnClickHandler.bind(this);
    this.settingsButtonOnClickHandler = this.settingsButtonOnClickHandler.bind(this);
    this.handleColourInputOnClick = this.handleColourInputOnClick.bind(this);
    this.handleOnBlur = this.handleOnBlur.bind(this);
    this.handleItemClick = this.handleItemClick.bind(this);

    //  TODO: 
    this.largerFontSizeClickHandler = this.largerFontSizeClickHandler.bind(this);
    this.smallerFontSizeClickHandler = this.smallerFontSizeClickHandler.bind(this);
    //  TODO: 
    this.inkBackgroundClickHandler = this.inkBackgroundClickHandler.bind(this);
    this.ceruleanBackgroundColourHandler = this.ceruleanBackgroundColourHandler.bind(this);
    this.lightBackgroundColourOnClickHandler = this.lightBackgroundColourOnClickHandler.bind(this);

    this.changeDimOnClickHandler = this.changeDimOnClickHandler.bind(this);
    this.changeLineHeightOnClickHandler = this.changeLineHeightOnClickHandler.bind(this);
    this.adjustCharactersPerLineOnClickHandler = this.adjustCharactersPerLineOnClickHandler.bind(this);

    this.adjustHslLineGradients = this.adjustHslLineGradients.bind(this);
    this.handleStaticStateChange = this.handleStaticStateChange.bind(this);
  }

  shouldComponentUpdate(nextProps, nextState) {
    const { lightning = {} } = nextProps;
    const { textItem, activeTabUrl, currentTabActive, previousTextItems } = lightning;
    const { lightning: previousLightning } = this.props;
    const previousActiveTabUrl = (previousLightning || {}).activeTabUrl;
    const previousTextItemText = ((previousLightning || {}).textItem || {})
      .text;

    //todo - what reason did i have for this?
    if (!textItem) {
      return false;
    }
    if (!(textItem || {}).urlString || (textItem || {}).urlString !== document.URL) {
      return false;
    }

    if (currentTabActive) {
      if (!previousActiveTabUrl || previousActiveTabUrl === activeTabUrl) {
        if (textItem && textItem.url && activeTabUrl) {
          if (activeTabUrl === textItem.url) {
            if (textItem.text) {

              if (previousTextItemText !== textItem.text) {
                userText = textItem.text;
                return true;
              }
            }
          }
        }
      }
    }
    if (this.state.lightningPlay !== nextState.lightningPlay) {
      return true;
    }
    if (
      +(+this.state.pageOpacity).toFixed(1) !==
      +(+nextState.pageOpacity).toFixed(1)
    ) {
      return true;
    }
    if (
      +(+this.state.lightningSpeed).toFixed(2) !==
      +(+nextState.lightningSpeed).toFixed(2)
    ) {
      return true;
    }
    if (this.state.lightningTextEnabled !== nextState.lightningTextEnabled) {
      return true;
    }
    if (this.state.display !== nextState.display) {
      return true;
    }
    if (this.state.backdropColour !== nextState.backdropColour) {
      return true;
    }
    if (+this.state.charactersPerLine !== +nextState.charactersPerLine) {
      return true;
    }
    if (this.state.settingsMenu !== nextState.settingsMenu) {
      return true;
    }
    if (this.state.fontFamily !== nextState.fontFamily) {
      return true;
    }
    if (
      +(+this.state.fontSize).toFixed(2) !== +(+nextState.fontSize).toFixed(2)
    ) {
      return true;
    }
    if (this.state.fontColour !== nextState.fontColour) {
      return true;
    }
    if (
      +(+this.state.lineHeight).toFixed(3) !==
      +(+nextState.lineHeight).toFixed(3)
    ) {
      return true;
    }
    if (this.state.backgroundColour !== nextState.backgroundColour) {
      return true;
    }
    if (this.state.lineGradientEnabled !== nextState.lineGradientEnabled) {
      return true;
    }
    if (
      this.state.lineGradientHslValue.first.join("") !==
      nextState.lineGradientHslValue.first.join("") ||
      this.state.lineGradientHslValue.second.join("") !==
      nextState.lineGradientHslValue.second.join("")
    ) {
      return true;
    }
    if (this.state.formatMenuInput !== nextState.formatMenuInput) {
      return false;
    }
    return false;
  }


  adjustHslLineGradients(lineGradientHslValue) {
    return (e) => {
      if (this.state.lineGradientHslValue !== lineGradientHslValue) {
        this.setState(prevState => {
          return {
            lineGradientHslValue,
            formatMenuInput: "previous:lineGradientHslValue"
          };
        });
      }
      return e.stopPropagation();
    }

  };

  settingsButtonOnClickHandler() {
    this.setState((prevState, props) => {
      return {
        settingsMenu: !({ ...prevState }).settingsMenu,
        formatMenuInput: "settingsMenu"
      };
    });
  }

  removeTextItemOnClickHandler() {
    const newPreviousTextItem = {
      url: this.props.lightning.activeTabUrl,
      urlString: this.props.lightning.textItem.urlString,
      text: formattedText
    };

    this.props.dispatch({
      type: "REMOVE_TEXT_ITEM",
      payload: {
        url: this.props.lightning.activeTabUrl,
        textItem: newPreviousTextItem
      }
    });
    location.reload(true);
  }




  handleColourInputOnClick(format) {
    return (e) => {
      this.handleFormatInput(format);
      return e.stopPropagation();
    };
  };

  // TODO: remove handleOnBlur and just call handleFormatInput directly
  handleOnBlur() {
    const formatMenuInput = this.state.formatMenuInput;
    return this.handleFormatInput(`previous:${formatMenuInput}`);
  };


  handleFormatInput(format) {
    return (e) => {
      this.setState(() => {
        return {
          formatMenuInput: format
        };
      });
      // TODO don't know why i did this... some reason
      // if (format === 'saveFormatted') {
      //   return e.stopPropagation();
      // }
    }

  };

  handleItemClick(format, value) {
    // TODO: remove () => from this onClick event and wrap following in
    return (e) => {
      this.setState(prevState => {
        const updatedState = {};
        updatedState[format] = value;
        return {
          ...updatedState,
          formatMenuInput: `previous:${format}`
        };
      });
    }
  };

  handleStaticStateChange(name, updatedState, stopPropagation, updateOptions) {
    if (updateOptions && updateOptions.updateState === false) {
      return;
    }
    return (e) => {
      this.setState((prevState) => {
        return {
          ...updatedState
        }
      });
      if (stopPropagation) {
        return e.stopPropagation
      }
    }

  }

  largerFontSizeClickHandler(e) {
    this.setState(prevState => {
      const fontSize = +(+({ ...prevState }).fontSize + 0.1).toFixed(2);
      return {
        fontSize,
        formatMenuInput: "previous:fontSize"
      };
    });
    return e.stopPropagation();
  }

  smallerFontSizeClickHandler(e) {

    this.setState(prevState => {
      const fontSize = +(+({ ...prevState }).fontSize - 0.1).toFixed(2);
      return {
        fontSize,
        formatMenuInput: "previous:fontSize"
      };
    });
    return e.stopPropagation();

  }
  //  todo - use staticEventHandler instead of defining new ones
  inkBackgroundClickHandler(e) {
    this.setState(prevState => {
      return {
        backgroundColour: "#1e2930",
        formatMenuInput: "previous:backgroundColour"
      };
    });
    return e.stopPropagation();
  }

  ceruleanBackgroundColourHandler(e) {
    this.setState(prevState => {
      return {
        backgroundColour: "#00303F",
        formatMenuInput: "previous:backgroundColour"
      };
    });
    return e.stopPropagation();
  }

  lightBackgroundColourOnClickHandler(e) {
    this.setState(prevState => {
      return {
        backgroundColour: "#ffffff",
        formatMenuInput: "previous:backgroundColour"
      };
    });
    return e.stopPropagation();
  }



  changeDimOnClickHandler(dimAction) {
    return (e) => {
      this.setState(prevState => {
        let pageOpacity;

        if (dimAction === 'less-dim') {
          pageOpacity = +(+({ ...prevState }).pageOpacity - 0.1).toFixed(1);

        } else if (dimAction === 'more-dim') {
          if (+({ ...this.state }).pageOpacity >= 0.9) {
            return e.stopPropagation();
          }
          pageOpacity = +(+({ ...prevState }).pageOpacity + 0.1).toFixed(1);
        }
        return {
          pageOpacity,
          formatMenuInput: "previous:pageOpacity"
        };
      });
      return e.stopPropagation();
    }
  }

  changeLineHeightOnClickHandler(lineHeightAction) {
    return (e) => {
      this.setState(prevState => {
        let lineHeight;

        if (lineHeightAction === "subtract-line-height") {
          lineHeight = +(+({ ...prevState }).lineHeight - 0.1).toFixed(3);
        } else {
          lineHeight = +(+({ ...prevState }).lineHeight + 0.1).toFixed(3);
        }
        return {
          lineHeight,
          formatMenuInput: "previous:lineHeight"
        };
      });
      return e.stopPropagation();
    }
  }

  adjustCharactersPerLineOnClickHandler(charactersPerLineAction) {
    return (e) => {
      let updatedCharactersPerLineState;
      const { charactersPerLine: charactersPerLineState } = { ...this.state };

      if (charactersPerLineAction === 'add-characters-per-line') {
        updatedCharactersPerLineState = charactersPerLineState + 3;
      } else {
        updatedCharactersPerLineState = charactersPerLineState - 3;
      }
      if (this.state.charactersPerLine !== updatedCharactersPerLineState) {
        setTimeout(() => {
          this.setState(prevState => {
            return {
              charactersPerLine: updatedCharactersPerLineState,
              formatMenuInput: "previous:charactersPerLine"
            };
          });
        }, 700);
      }
      return e.stopPropagation();
    }
  };

  render() {
    const updateParagraphLine = (paragraphLine, paragraphParts, lineIndex) => {
      return [
        ...paragraphLine.slice(),
        paragraphParts.slice(0, lineIndex).trim()
      ];
    };

    const setParagraphLines = paragraphArray => {
      let formattedParagraph = [];
      paragraphCount = paragraphArray.length;

      for (let i = 0, len = paragraphCount; i < len; i++) {
        let paragraphLine = [];
        let paragraphParts = paragraphArray.slice()[i];
        if (paragraphParts === "") {
          continue;
        }

        if (paragraphParts.length < this.state.charactersPerLine) {
          paragraphLine = updateParagraphLine(
            paragraphLine,
            paragraphParts,
            paragraphParts.length
          );
          formattedParagraph = [...formattedParagraph.slice(), paragraphLine];
          continue;
        }
        while (paragraphParts.length > this.state.charactersPerLine) {
          for (let n = this.state.charactersPerLine, num = 0; n > num; n--) {
            if (paragraphParts[n] === " ") {
              paragraphLine = updateParagraphLine(
                paragraphLine,
                paragraphParts,
                n
              );
              paragraphParts = paragraphParts.slice(n);
              break;
            }
          }
        }
        if (paragraphParts.length) {
          paragraphLine = [...paragraphLine.slice(), paragraphParts.slice()];
        }
        formattedParagraph = [...formattedParagraph.slice(), paragraphLine];
      }
      return formattedParagraph;
    };

    const shouldNotTextFormat = () => {
      const formatMenuInput = this.state.formatMenuInput || "";
      const fr = menuFormat => {
        return formatMenuInput.indexOf(menuFormat) > -1;
      };
      // fr("backgroundOpacity") ||


      return (
        fr("display") ||
        fr("settingsMenu") ||
        fr("fontFamily") ||
        fr("fontSize") ||
        fr("fontColour") ||
        fr("lineHeight") ||
        fr("lightningSpeed") ||
        fr("backgroundColour") ||
        fr("backdropColour") ||
        fr("formatMenuInput") ||
        fr("lightningTextEnabled") ||
        fr("lightningPlay") ||
        fr("pageOpacity") ||
        fr("saveFormatted") ||
        fr("donate")
      );
    };

    const gradientFormatSetup = (
      textItem,
      lineGradientHslValue,
      lineGradientEnabled
    ) => {
      if (!textItem || !textItem.text || typeof textItem.text !== "string") {
        return false;
      }
      const shouldNotFormat = shouldNotTextFormat();
      let paragraphArray;
      let userInputText = textItem.text.trim();
      if (userInputText === "default-web-article-content") {
        if (shouldNotFormat) {
          return formattedHTML;
        }
        if (!formattedWebArticleContent) {
          // todo: or if formattedHTML has already be assigned if (formattedHTML) { return false; }
          formattedWebArticleContent = formatWebPageText() || "";
        }
        formattedText = formattedWebArticleContent
          .slice(0)
          .trim()
          .replace(/&amp;/g, "`&`")
          .replace(/&lt;/g, "`<`")
          .replace(/&quot;/g, "`")
          .replace(/\b[A-Z]{2,}\b/g, match => {
            return match.toLowerCase();
          });
        paragraphArray = formattedText
          .slice(0)
          .trim()
          .split(/\n/g);
      } else {
        if (userInputText === "") {
          return false;
        }
        // '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;
        const formattedUserText = userInputText
          .slice(0)
          .replace(/&rsquo;|&lsquo;|&rdquo;|&ldquo;/g, "’")
          .replace(/&amp;/g, "`&`")
          .replace(/&lt;/g, "`<`")
          .replace(/&quot;/g, "`")
          .replace(/&nbsp;/g, " ")
          .replace(/[‐‑‒–—―\-]|&mdash;|mdash;| ndash; | &ndash;/g, " - ")
          .replace(/<[^>]*>/g, "")
          .replace(/( )+/g, " ")
          .replace(/\b[A-Z]{2,}\b/g, match => {
            return match.toLowerCase();
          })
          .trim();

        formattedText = formattedUserText.slice(0);
        // ?

        paragraphArray = formattedUserText.slice(0).split(/\n/g);
      }
      const formatted = setParagraphLines(paragraphArray);
      return formattedParagraphs(
        formatted,
        lineGradientHslValue,
        lineGradientEnabled
      );
    };



    const formattedParagraphWithGradientsEnabled = (
      paragraph,
      indexKey,
      lineGradientHslValue
    ) => {
      let lineNum = 0,
        lineFormatNumber;

      const setLineBreakElement = (lineArrayWithHslValues, lineIndex) => {
        if (lineArrayWithHslValues.length - 1 === lineIndex) {
          return (
            <br />
          )
        }
      }
      return (
        <p className="ui text" key={indexKey} style={{ lineHeight: "inherit" }}>
          {paragraph.map((line, lineIndex) => {
            lineNum = lineNum === 4 ? 1 : lineNum + 1;
            if (indexKey % 2 === 0 || indexKey === 0) {
              lineFormatNumber = lineNum;
            } else {
              if (lineNum === 4) {
                lineFormatNumber = 1;
              } else {
                lineFormatNumber = lineNum + 1;
              }
            }
            const lineArray = line.split(" ");
            const lineArrayWithHslValues = setLineArrayWithHslValues(
              lineArray,
              lineFormatNumber,
              lineGradientHslValue
            );
            // todo: indent paragraphs that start in bulleted form, e.g., 1. 'paragraph text', a: 'paragraph text'

            return (
              <span
                className={`format-line line-${lineFormatNumber}`}
                key={lineIndex}
              >
                {lineArrayWithHslValues.slice(0).map((lineItem, index) => {
                  const hsl = lineItem.hsl;
                  const colourValue = `hsl(${hsl[0]}, ${hsl[1]}%, ${hsl[2]}%)`;
                  {/* TODO: add <br/>> elements for now ---- for printing && saving to pdf purposes - consider changing later so <br/>> are only added when the user wants to print or save */ }
                  return (
                    <span>
                      <span
                        className={`format-word word-${index}`}
                        key={index}
                        style={{ color: colourValue }}
                      >
                        {`${lineItem.word}${
                          lineArrayWithHslValues.length - 1 === index ? "" : " "
                          }`}
                      </span>
                      {setLineBreakElement(lineArrayWithHslValues, index)}
                    </span>
                  );
                })}
              </span>
            );
          })}
        </p>
      );
    };

    const formattedParagraphWithGradientsDisabled = (paragraph, indexKey) => {
      return (
        <p
          className="ui text gradients-disabled"
          key={indexKey}
          style={{ lineHeight: "inherit" }}
        >
          {paragraph.map((line, lineIndex) => {
            const lineArray = line.split(" ");
            return (
              <span className={`format-line line-${lineIndex}`} key={lineIndex}>
                {lineArray.slice(0).map((lineItem, index) => {
                  return (
                    <span
                      className={`format-word word-${index}`}
                      key={index}
                      style={{ color: "inherit" }}
                    >
                      {`${lineItem}${
                        lineArray.length - 1 === index ? "" : " "
                        }`}
                    </span>
                  );
                })}
              </span>
            );
          })}
        </p>
      );
    };

    const formattedParagraph = (
      paragraph,
      indexKey,
      lineGradientHslValue,
      lineGradientEnabled
    ) => {
      if (lineGradientEnabled) {
        return formattedParagraphWithGradientsEnabled(
          paragraph,
          indexKey,
          lineGradientHslValue
        );
      }
      return formattedParagraphWithGradientsDisabled(paragraph, indexKey);
    };


    const formattedParagraphs = (
      formatted,
      lineGradientHslValue,
      lineGradientEnabled
    ) => {
      return formatted.map((paragraph, index) =>
        formattedParagraph(
          paragraph,
          index,
          lineGradientHslValue,
          lineGradientEnabled
        )
      );
    };

    const settingsButtons = () => {
      const style = this.state.settingsMenu ? { top: "8.5em" } : {};
      return (
        <div className="format-settings-icons">
       
             <Popup
              trigger={
                <div
            className="format-settings-button"
            style={{
            opacity: '.3',
            padding: '1.5em',
            marginRight: '1em',
            background: 'rgba(255,255,255,.15)',
            borderRadius: '50%',
            marginTop: `${this.state.settingsMenu ? '9em' : 'auto'}`
          }}
            onClick={this.settingsButtonOnClickHandler}
          >
                <Image
                  src={`chrome-extension://${chrome.runtime.id}/settings.png`}
                  style={{    width: "3em",
    height: "auto"}}
                  avatar={true}
                />
                 </div>
              }
              content={`${this.state.settingsMenu ? 'Close' : 'Open'} Settings Menu`}
            />
         

       
            <Popup
              trigger={
                <div 
                onClick={this.removeTextItemOnClickHandler}
                className="format-maximize-button" style={{
            opacity: '.3',
            padding: '1.5em',
            marginLeft: '.5em',
            background: 'rgba(255,255,255,.15)',
            borderRadius: '50%',
            marginTop: `${this.state.settingsMenu ? '9em' : 'auto'}`
          }}>
                <Image
                  src={`chrome-extension://${chrome.runtime.id}/close.png`}
                  style={{width: "2.5em", height: "auto"}}
                  avatar={true}
                />
                </div>
              }
              content={`Go back to ${document.URL}`}
            />
          
        </div>
      );
    };

    const formatMenuInput = (format, type = "text", style = {}) => {


      const handleOnChange = ({ target: { value } }) => {
        if (format === "lineGradientHslValue:first") {
          const { h, s, l } = hexToHSL(value);
          // JSON.parse
          const lineGradientHslValueState = this.state.lineGradientHslValue;
          // TODO - fix using deconstruction notation ...{} -> created this before I updated ecma standard, so a few of these may be lurking about
          const updatedLineGradientState = Object.assign(
            {},
            lineGradientHslValueState,
            {
              first: [
                Math.round(h * 100 * 3.62),
                Math.round(s * 100),
                Math.round(l * 100)
              ]
            },
            { firstHexValue: value }
          );
          return this.setState(prevState => {
            return {
              lineGradientHslValue: updatedLineGradientState,
              formatMenuInput: "previous:updatedLineGradientState"
            };
          });
        } else if (format === "lineGradientHslValue:second") {
          const { h, s, l } = hexToHSL(value);
          // TODO - fix using deconstruction notation ...{} -> created this before I updated ecma standard, so a few of these may be lurking about

          const lineGradientHslValueState = this.state.lineGradientHslValue;
          const updatedLineGradientState = Object.assign(
            {},
            lineGradientHslValueState,
            {
              second: [
                Math.round(h * 100 * 3.62),
                Math.round(s * 100),
                Math.round(l * 100)
              ]
            },
            { secondHexValue: value }
          );
          return this.setState(prevState => {
            return {
              lineGradientHslValue: updatedLineGradientState,
              formatMenuInput: "previous:updatedLineGradientState"
            };
          });
        } else {
          this.setState(prevState => {
            if (format === "charactersPerLine") {
              // TODO: just returning for now... temporary measure to prevent crash due to too over-use... implement throttle or timeout later or some other minimum character value limit later
              return;
              value = +value;
            }
            // TODO: no timeout?
            const updatedState = {};
            updatedState[format] = value;
            return {
              ...updatedState,
              formatMenuInput: `previous:${format}`
            };
          });
        }
      };

      const colourInputValue = format => {
        if (format === "lineGradientHslValue:first") {
          return this.state.lineGradientHslValue.firstHexValue;
        } else if (format === "lineGradientHslValue:second") {
          return this.state.lineGradientHslValue.secondHexValue;
        }
        return this.state[format];
      };

      const colourInput = backgroundColour => {
        // todo: hex values on pre-set colours
        const value = colourInputValue(format);

        return (
          <div style={style} className="format-menu-input background-color">
            {/*pattern="#[a-f0-9]{6}"*/}
            <input
              className="ui input"
              type="color"
              title="hexadecimal color"
              value={value}
              placeholder={value}
              onChange={handleOnChange}
              onClick={this.handleColourInputOnClick(format)}
              onBlur={this.handleOnBlur}
            />
          </div>
        );
      };
      //onBlur={handleOnBlur}
      const textInput = () => {
        return (
          <div style={style} className="ui input format-menu-input text">
            <input
              type={type}
              onChange={handleOnChange}
              onClick={this.handleFormatInput(format)}
              value={this.state[format]}
            />
          </div>
        );
      };

      if (type === "color") {
        return colourInput();
      } else {
        return textInput();
      }
    };




    const reactToPrint = () => {
      return (
        <div style={{ width: 'fitContent' }}>
          <ReactToPrint
            trigger={() => <p style={{padding: '1em'}}>Save as PDF Document</p>}
            content={() => this.lightningArticleTextRef}
          />
        </div>

      )
    }
    const donateButton = () => {
      return (
        <div style={{ position: 'relative', padding: '1em 5.5em 2em 3em' }}>

          <a style={{ position: 'absolute' }} className={'ui'} target={'_blank'} href={'https://www.canadahelps.org/en/'}>
            <Image
              id={"paypal-icon-container"}
              className={'paypal-icon-img'}
              src={`chrome-extension://${chrome.runtime.id}/donate.png`}
              style={{ width: '33px', height: 'auto', position: 'absolute', top: '-.75em', right: '5.45em' }}
              avatar={true}
            />
            Thank you :)
        </a>
        </div>
      )
    }

    const toggleEnableLineGradients = lineGradientHslValue => {
      this.setState((prevState, props) => ({
        lineGradientEnabled: !({ ...prevState }).lineGradientEnabled,
        formatMenuInput: "previous:lineGradientEnabled"
      }));
    };

    const settingsMenu = () => {
      return (
        <div>
          <div className="settings-format-menu">

            <Menu icon="labeled" size="small" className={"fixedMenu"}>
              <Menu.Menu
                icon="labeled"
                size="small"
                position="left"
                className={"ui left small stackable menu fixedMenu"}
              >
                <Dropdown
                  style={{ display: "inline-block" }}
                  item
                  text="Font Style"
                >
                  <Dropdown.Menu>
                    <Dropdown.Item>

                      <p style={
                        {
                          textAlign: 'center',
                          fontWeight: '600 !important',
                          textDecoration: 'underline'
                        }
                      }>
                        Font Family
                </p>
                    </Dropdown.Item>
                    <Dropdown.Item
                      onClick={this.handleItemClick("fontFamily", "garamond")}
                    >
                      Garamond
                    </Dropdown.Item>
                    <Dropdown.Item
                      onClick={this.handleItemClick("fontFamily", "palatino")}
                    >
                      Palatino
                    </Dropdown.Item>
                    <Dropdown.Item
                      onClick={this.handleItemClick("fontFamily", "vt323")}
                    >
                      VT323
                    </Dropdown.Item>
                    <Dropdown.Item
                      onClick={this.handleItemClick("fontFamily", "montserrat")}
                    >
                      Montserrat
                    </Dropdown.Item>
                    <Dropdown.Item
                      onClick={this.handleItemClick("fontFamily", "lato")}
                    >
                      Lato
                    </Dropdown.Item>
                    <Dropdown.Item
                      onClick={this.handleItemClick("fontFamily", "times-new-roman")}
                    >
                      Times New Roman
                    </Dropdown.Item>
                    <Dropdown.Item
                      onClick={this.handleItemClick("fontFamily", `titillium-web`)}
                    >
                      Tillium Web
                    </Dropdown.Item>
                    <Dropdown.Item>

                      <p style={
                        {
                          textAlign: 'center',
                          fontWeight: '600 !important',
                          textDecoration: 'underline'
                        }
                      }>
                        Font Size
                      </p>
                    </Dropdown.Item>
                    <Dropdown.Item style={{ marginBottom: "-1em" }}>
                      <Button
                        size="tiny"
                        className={"format-lightning-button-font-add"}
                        icon={true}
                        style={{
                          minWidth: "97%",
                          height: "inherit",
                          margin: "0!important;"
                        }}
                        primary
                        labelPosition="right"
                        onClick={this.largerFontSizeClickHandler}
                      >
                     
                        Larger
                      </Button>
                    </Dropdown.Item>
                    <Dropdown.Item style={{ marginTop: "-1.3em" }}>
                      <Button
                        size="tiny"
                        icon={true}
                        secondary
                        className={"format-lightning-button-font-subtract"}
                        style={{
                          minWidth: "97%",
                          marginTop: "-1em",
                          height: "inherit"
                        }}
                        labelPosition="right"
                        onClick={this.smallerFontSizeClickHandler}
                      >
                       
                        Smaller
                      </Button>
                    </Dropdown.Item>
                    <Dropdown.Item>{formatMenuInput("fontSize")}</Dropdown.Item>
                    <br />
                  </Dropdown.Menu>
                </Dropdown>

                <Dropdown
                  style={{ display: "inline-block" }}
                  item
                  text="Background Color"
                >
                  <Dropdown.Menu
                    className={`transition ${
                      this.state.formatMenuInput === "backgroundColour"
                        ? "visible"
                        : ""
                      }`}
                  >

                    <Dropdown.Item>

                      <p style={
                        {
                          textAlign: 'center',
                          fontWeight: '600 !important',
                          textDecoration: 'underline'
                        }
                      }>
                        Text Background
                </p>
                    </Dropdown.Item>
                    <Dropdown.Item
                      onClick={this.inkBackgroundClickHandler}
                    >
                      Ink
                    </Dropdown.Item>
                    <Dropdown.Item
                      onClick={this.ceruleanBackgroundColourHandler}
                    >
                      Cerulean
                    </Dropdown.Item>
                    <Dropdown.Item
                      onClick={this.lightBackgroundColourOnClickHandler}
                    >
                      Light
                    </Dropdown.Item>
                    <Dropdown.Item>
                      <Grid>
                        <Grid.Row className="background-colour-row">
                          <Grid.Column width={8}>
                            {formatMenuInput("backgroundColour")}
                          </Grid.Column>
                          <Grid.Column width={8}>
                            {formatMenuInput("backgroundColour", "color")}
                          </Grid.Column>
                        </Grid.Row>
                      </Grid>
                    </Dropdown.Item>


                    <Dropdown.Item>

                      <p style={
                        {
                          textAlign: 'center',
                          fontWeight: '600 !important',
                          textDecoration: 'underline'
                        }
                      }>
                        Background Colour
                </p>
                    </Dropdown.Item>

                    <Dropdown.Item
                      onClick={this.handleStaticStateChange('backdropColour',
                        { backdropColour: '#aab0c0' }, 'stopPropagation', false)}
                    >
                      Default
                    </Dropdown.Item>

                    <Dropdown.Item
                      onClick={this.handleStaticStateChange('backdropColour',
                        { backdropColour: '#ffffff' }, 'stopPropagation', false)}
                    >
                      Snow
                    </Dropdown.Item>

                    <Dropdown.Item
                      onClick={this.handleStaticStateChange('backdropColour',
                        { backdropColour: '#000000' }, 'stopPropagation', false)}
                    >
                      Licorice
                    </Dropdown.Item>

                    <Dropdown.Item>
                      <Grid>
                        <Grid.Row className="background-colour-row">
                          <Grid.Column width={8}>
                            {formatMenuInput("backdropColour")}
                          </Grid.Column>
                          <Grid.Column width={8}>
                            {formatMenuInput("backdropColour", "color")}
                          </Grid.Column>
                        </Grid.Row>
                      </Grid>
                    </Dropdown.Item>


                    <Dropdown.Item>
                      <p style={
                        {
                          textAlign: 'center',
                          fontWeight: '600 !important',
                          textDecoration: 'underline'
                        }
                      }>
                        Page Dimness
                </p>
                    </Dropdown.Item>
                    <Dropdown.Item>
                      {/* <span>Page Dimness</span> */}
                      <Grid>
                        <Grid.Row className="characters-per-line-row">
                          <Grid.Column width={16}>
                            <Button
                              size="tiny"
                              icon={true}
                              secondary
                              style={{ minWidth: "97%", marginTop: "3px" }}
                              disabled={+({ ...this.state }).pageOpacity <= 0}
                              labelPosition="right"
                              onClick={this.changeDimOnClickHandler('less-dim')}
                            >
                           
                              Less Dim
                            </Button>
                          </Grid.Column>
                        </Grid.Row>
                      </Grid>
                    </Dropdown.Item>
                    <Dropdown.Item>
                      <Grid>
                        <Grid.Row
                          className="characters-per-line-row"
                          style={{ marginBottom: "1em" }}
                        >
                          <Grid.Column width={16}>
                            <Button
                              size="tiny"
                              icon={true}
                              primary
                              style={{ minWidth: "97%" }}
                              disabled={+({ ...this.state }).pageOpacity >= 0.9}
                              labelPosition="right"
                              onClick={this.changeDimOnClickHandler('more-dim')}
                            >
                             
                              More Dim
                            </Button>
                          </Grid.Column>
                        </Grid.Row>
                      </Grid>
                    </Dropdown.Item>


                  </Dropdown.Menu>
                </Dropdown>


                <Dropdown
                  style={{ display: "inline-block" }}
                  item
                  text="Line Height"
                >
                  <Dropdown.Menu
                    className={`transition ${
                      this.state.formatMenuInput === "lineHeight"
                        ? "visible"
                        : ""
                      }`}
                  >
                    <Dropdown.Item className="characters-per-line">
                      <Grid>
                        <Grid.Row className="characters-per-line-row">
                          <Grid.Column width={8}>
                            <Button
                              size="tiny"
                              icon={true}
                              primary
                              labelPosition="right"
                              onClick={this.changeLineHeightOnClickHandler('add-line-height')}
                            >
                            
                              Increase
                            </Button>
                          </Grid.Column>
                        </Grid.Row>
                      </Grid>
                    </Dropdown.Item>
                    <Dropdown.Item className="characters-per-line">
                      <Grid>

                        <Grid.Row className="characters-per-line-row">
                          <Grid.Column width={8}>
                            <Button
                              size="tiny"
                              icon={true}
                              secondary
                              labelPosition="right"
                              onClick={this.changeLineHeightOnClickHandler('subtract-line-height')}
                            >
                             
                              Decrease
                            </Button>
                          </Grid.Column>
                        </Grid.Row>
                      </Grid>
                    </Dropdown.Item>
                    <Dropdown.Item style={{ marginBottom: "1em" }}>
                      <Grid>
                        <Grid.Row className="characters-per-line-row">
                          <Grid.Column width={14}>
                            {formatMenuInput("lineHeight", "number")}
                          </Grid.Column>
                        </Grid.Row>
                      </Grid>
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
                <Dropdown
                  style={{ display: "inline-block" }}
                  item
                  text="Characters Per Line"
                >
                  <Dropdown.Menu
                    className={`transition ${
                      this.state.formatMenuInput === "charactersPerLine"
                        ? "visible"
                        : ""
                      }`}
                  >
                    <Dropdown.Item className="characters-per-line">
                      <Grid>
                        <Grid.Row className="characters-per-line-row">
                          <Grid.Column width={8}>
                            <Button
                              size="tiny"
                              icon={true}
                              primary
                              labelPosition="right"
                              onClick={this.adjustCharactersPerLineOnClickHandler('add-characters-per-line')}
                            >
                            
                              Add
                            </Button>
                          </Grid.Column>
                        </Grid.Row>
                      </Grid>
                    </Dropdown.Item>
                    <Dropdown.Item className="characters-per-line">
                      <Grid>
                        <Grid.Row className="characters-per-line-row">
                          <Grid.Column width={8}>
                            <Button
                              size="tiny"
                              icon={true}
                              secondary
                              labelPosition="right"
                              onClick={this.adjustCharactersPerLineOnClickHandler('subtract-characters-per-line')}
                            >
                           
                              Subtract
                            </Button>
                          </Grid.Column>
                        </Grid.Row>
                      </Grid>
                    </Dropdown.Item>
                    <Dropdown.Item className="characters-per-line">
                      <Grid>
                        <Grid.Row>
                          <Grid.Column width={11}>
                            {formatMenuInput("charactersPerLine", "number")}
                          </Grid.Column>
                       
                  
                        </Grid.Row>
                      </Grid>
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
                <div className="ui item">
                  Line Gradients
                  <Checkbox
                    className="line-gradients-format"
                    label={this.state.lineGradientEnabled ? "On" : "Off"}
                    toggle={true}
                    checked={this.state.lineGradientEnabled}
                    onClick={e => {
                      return toggleEnableLineGradients(
                        this.state.lineGradientHslValue
                      );
                      // return e.stopPropagation();
                    }}
                  />
                </div>
                <Dropdown
                  style={{
                    display: this.state.lineGradientEnabled
                      ? "inline-block"
                      : "none"
                  }}
                  item
                  text="Line Gradient Colors"
                >
                  <Dropdown.Menu
                    className={`transition ${
                      this.state.formatMenuInput === "lineGradientStart" ||
                        this.state.formatMenuInput === "lineGradientStop"
                        ? "visible"
                        : ""
                      }`}
                  >
                    <Dropdown.Item
                      onClick={this.adjustHslLineGradients(GRADIENT_HSL_VALUES.default)}
                    >
                      Default
                    </Dropdown.Item>
                    <Dropdown.Item
                      onClick={this.adjustHslLineGradients(GRADIENT_HSL_VALUES.darkDarkGrey)}
                    >
                      Dark - Dark Grey
                    </Dropdown.Item>
                    <Dropdown.Item
                      onClick={this.adjustHslLineGradients(GRADIENT_HSL_VALUES.whiteLightBlue)}
                    >
                      White - Light Blue
                    </Dropdown.Item>
                    <Dropdown.Item
                      onClick={this.adjustHslLineGradients(GRADIENT_HSL_VALUES.lighterLightBlue)}
                    >
                      Lighter Blue - Light Blue
                    </Dropdown.Item>

                    <Dropdown.Item
                      onClick={this.adjustHslLineGradients(GRADIENT_HSL_VALUES.greyShadeWhite)}
                    >
                      Shaded Grey - White
                    </Dropdown.Item>
                    <Dropdown.Item
                      onClick={this.adjustHslLineGradients(GRADIENT_HSL_VALUES.darkerGreyGrey)}
                    >
                      Grey - Darker Grey
                    </Dropdown.Item>
                    <Dropdown.Item>
                    <Grid>
                        <Grid.Row className="background-colour-row">
                          <Grid.Column width={6}>
                          {formatMenuInput("lineGradientHslValue:first", "color", {
                        display: "inline"
                      })}
                          </Grid.Column>

                          {/* <Grid.Column width={4}>
                        <span> - </span>
                          </Grid.Column> */}

                          <Grid.Column width={6}>
                          {formatMenuInput("lineGradientHslValue:second", "color", {
                        display: "inline"
                      })}
                          </Grid.Column>
                          </Grid.Row>
                          </Grid>
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
                <Dropdown
                  item
                  text="Font Color"
                  style={{
                    display: this.state.lineGradientEnabled
                      ? "none"
                      : "inline-block"
                  }}
                >
                  <Dropdown.Menu
                    className={`transition ${
                      this.state.formatMenuInput === "fontColour"
                        ? "visible"
                        : ""
                      }`}
                  >
                    <Dropdown.Item
                      onClick={this.handleStaticStateChange('fontColour', {
                        fontColour: "#ffffff",
                        formatMenuInput: "previous:fontColour"
                      }, false)}
                    >
                      Light
                    </Dropdown.Item>
                    <Dropdown.Item
                      onClick={() => {
                        this.setState(() => {
                          return {
                            fontColour: "#313943",
                            formatMenuInput: "previous:fontColour"
                          };
                        });
                      }}
                    >
                      Dark
                    </Dropdown.Item>
                    <Dropdown.Item
                      onClick={() => {
                        this.setState(() => {
                          return {
                            fontColour: "#523ef2",
                            formatMenuInput: "previous:fontColour"
                          };
                        });
                      }}
                    >
                      Blue
                    </Dropdown.Item>
                    <Dropdown.Item>
                      {formatMenuInput("fontColour", "color")}
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>

                <Dropdown
                  item
                  className={"ui icon"}
                  style={{ display: "inline-block" }}
                  text="Lightning Text"
                  onClick={e => {
                    // const scrollToTop = !this.state.lightningPlay;
                    this.setState(
                      (prevState) => {
                        const {
                          lightningPlay: prevLightningPlay,
                          lightningTextEnabled: prevLightningTextEnabled
                        } = { ...prevState };
                        const lightningTextEnabled = !prevLightningTextEnabled;
                        // only set lightningPlay to false if it's currently enabled
                        const lightningPlay = prevLightningPlay
                          ? !prevLightningPlay
                          : prevLightningPlay;
                        return {
                          lightningTextEnabled,
                          lineGradientEnabled: !lightningTextEnabled,
                          lightningPlay,
                          settingsMenu: false,
                          formatMenuInput: "lightningPlay"
                        };
                      }
                    );

                  }}
                >
                  <Dropdown.Menu>
                    <Dropdown.Item>Lightning Text</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
                <Dropdown
                  style={{ display: "inline-block" }}
                  item
                  text="Save"
                  onClick={this.handleFormatInput('saveFormatted')}

                >
                  <Dropdown.Menu
                    className={`transition ${
                      this.state.formatMenuInput === "saveFormatted"
                        ? "visible"
                        : ""
                      }`}
                  >

                    <Dropdown.Item>

                      {reactToPrint()}
                    </Dropdown.Item>


                  </Dropdown.Menu>
                </Dropdown>
                {/* <Dropdown
                  style={{ display: "inline-block" }}
                  item
                  text="Donate"
                  onClick={(e) => {
                    this.setState(() => {
                      return {
                        formatMenuInput: 'donate'
                      }
                    });
                  }}
                >
                  <Dropdown.Menu
                    className={`transition ${
                      this.state.formatMenuInput === "donate"
                        ? "visible"
                        : ""
                      }`}
                  >

                    <Dropdown.Item>
                      {donateButton()}
                    </Dropdown.Item>

                  </Dropdown.Menu>
                </Dropdown> */}
              </Menu.Menu>
            </Menu>
          </div>
        </div>
      );
    };

    const closeLightningDisplayButton = ({ playActivated }) => {
      // const lightningButtonStyles = {
      //   background: "rgba(255, 255, 255, 0.03)",
      //   color: "rgb(245, 243, 243) !important",
      //   opacity: "0.5",
      //   marginRight: "1em",
      //   position: `${playActivated ? "absolute" : "relative"}`,
      //   right: `${playActivated ? "0.25em" : "initial"}`,
      //   top: `${playActivated ? "0.25em" : "initial"}`,
      //   zIndex: "99999",
      //   padding: ".58571429em .58571429em .58571429em !important"
      // };
      // margin-right: -.5em;
      // margin-bottom: 1.5em;
      // margin-top: -3em;
      // background: none;
      // z-index: 99999;
      const lightningButtonStyles = {
        marginBottom: "1.5em",
        marginTop: "-1.5em"
      }
      return (
        <div>
          <Grid>
            <Grid.Row>
              <Grid.Column width="16" style={{ textAlign: "right" }}>
                <Button
                  className={`close-lightning-display ${
                    playActivated ? "play-activated" : "play-unactivated"
                    }`}
                  style={lightningButtonStyles}
                  icon
                  onClick={this.handleStaticStateChange('closeLightningTextSetup', {
                    lightningPlay: false,
                    lightningTextEnabled: false,
                    lineGradientEnabled: true,
                    fontSize: 1.6,
                    formatMenuInput: "previous:lightningPlay"
                  }, 'stopPropagation')}


                >
                 <Image
                  src={`chrome-extension://${chrome.runtime.id}/close.png`}
                  style={{height: "auto", width: ".85em", marginLeft: 'auto', marginRight: 'auto'}}
                />
               
                </Button>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </div>
      );
    };
    const lightningTextDisplay = () => {
      const forwardDisabled = +(+this.state.lightningSpeed).toFixed(2) <= 0.0;
      const backwardDisabled =
        +(+this.state.lightningSpeed).toFixed(2) >= 100.0;

      if (
        this.state.lightningTextEnabled &&
        formattedText &&
        formattedText.length
      ) {
        if (!this.state.lightningPlay) {
          return (
            <div
              className="lightning-text-displayer-enabled"
            >
              <div
                className="lightning-card"
                style={{
                  background: "rgba(0, 0, 0, 0.1)",

                }}
              >
                <Card.Content
                  style={{
                    background: "rgba(0,0,0,.1)"
                  }}
                >
                  <div
                    className={"lightning-speed-controls"}
                    style={{ width: "100%", margin: '1em', padding: '2em' }}
                  >
                    {closeLightningDisplayButton({ playActivated: false })}
                    <Grid>
                      <Grid.Row>
                        <Grid.Column
                          width="16"
                          style={{ textAlign: "center", marginBottom: "1em" }}
                        >
                          <Button
                            icon
                            labelPosition="left"
                            style={{
                              background: "rgb(57, 55, 80)",
                              width: "19em",
                              padding: "1.5em"
                            }}
                            onClick={this.handleStaticStateChange(
                              'startLightningText', {
                                lightningPlay: true,
                                formatMenuInput: "previous:lightningPlay"
                              }, 'stopPropagation')}
                          >
                          
                            <span
                              style={{
                                color: "rgba(250, 251, 165, 0.79)",
                                fontSize: "1.4em",
                                letterSpacing: ".2px"
                              }}
                            >
                              Start
                            </span>
                          </Button>
                        </Grid.Column>
                      </Grid.Row>

                      <Grid.Row>
                        <Grid.Column width="4" style={{ textAlign: "right" }}>
                          <Button
                            disabled={backwardDisabled}
                            size="mini"
                            icon
                            labelPosition="left"
                            onClick={e => {
                              if (backwardDisabled) {
                                return e.stopPropagation();
                              }
                              this.setState(prevState => {
                                const {
                                  lightningSpeed: previousLightningSpeed
                                } = { ...prevState };
                                const updatedLightningSpeed = +(
                                  previousLightningSpeed + 0.1
                                ).toFixed(2);
                                return {
                                  lightningSpeed: updatedLightningSpeed,
                                  formatMenuInput: "previous:lightningPlay"
                                };
                              });
                              return e.stopPropagation();
                            }}
                          >
                           
                            Slower 0.1{" "}
                            <div
                              style={{
                                color: "#db2828",
                                verticalAlign: "top",
                                fontSize: ".9em",
                                display: "inline",
                                marginLeft: "0.075em"
                              }}
                            >
                              x
                            </div>
                          </Button>
                        </Grid.Column>

                        <Grid.Column width="8" style={{ textAlign: "center" }}>
                          <span style={{ fontSize: "0.85em" }}>
                            Lightning Transition Speed:{" "}
                            <Label
                              style={{
                                marginLeft: "0.5em",
                                verticalAlign: "middle"
                              }}
                            >
                              {(+({ ...this.state }).lightningSpeed).toFixed(1)}
                            </Label>
                          </span>
                        </Grid.Column>

                        <Grid.Column width="4" style={{ textAlign: "left" }}>
                          <Button
                            size="mini"
                            icon
                            labelPosition="left"
                            disabled={forwardDisabled}
                            onClick={e => {
                              if (forwardDisabled) {
                                return e.stopPropagation();
                              }
                              this.setState(prevState => {
                                const {
                                  lightningSpeed: previousLightningSpeed
                                } = prevState;
                                const updatedLightningSpeed = +(
                                  previousLightningSpeed - 0.1
                                ).toFixed(2);
                                return {
                                  lightningSpeed: updatedLightningSpeed,
                                  formatMenuInput: "previous:lightningPlay"
                                };
                              });
                              return e.stopPropagation();
                            }}
                          >
                            Faster 0.1{" "}
                            <div
                              style={{
                                color: "#2185d0",
                                verticalAlign: "top",
                                fontSize: ".9em",
                                display: "inline",
                                marginLeft: "0.075em"
                              }}
                            >
                              x
                            </div>
                         
                          </Button>
                        </Grid.Column>
                      </Grid.Row>
                    </Grid>
                  </div>
                </Card.Content>
              </div>
            </div>
          );
        }
        return (
          <div
            className="lightning-text-displayer-enabled"
            style={{ position: "relative" }}
          >
            {closeLightningDisplayButton({ playActivated: true })}
            <LightningText
              text={formattedText}
              fontSize={this.state.fontSize}
              lightningSpeed={this.state.lightningSpeed}
              fontColour={this.state.fontColour}
            />
          </div>
        );
      } else {
        return <div className="lightning-text-displayer-disabled" />;
      }
    };
    const lightning = (this.props || {}).lightning;
    const textItems = (lightning || {}).textItems || {};
    const textItem = textItems[lightning.activeTabUrl];
    if (!textItem) {
      return (<span></span>);
    }
    if (document.URL !== this.props.lightning.textItem.urlString) {
      return (<span></span>);
    }
    const lightningReaderElement = document.getElementsByClassName(
      "lightning-reader-chrome-extension-dh"
    )[0];
    formattedHTML = gradientFormatSetup(
      textItem,
      this.state.lineGradientHslValue,
      this.state.lineGradientEnabled,
      this.state.formatMenuInput,
      this.state.charactersPerLine
    );


    if (!lightningReaderElement && formattedHTML) { 
let headElement = document.createElement("HEAD");
      let bodyElement = document.createElement("BODY");
      let fragment = document.createRange()
        .createContextualFragment(`<headelement><title>Sky Reader</title><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
</headelement><bodyelement><div class='lightning-reader-chrome-extension-dh'></div></bodyelement>`);

      for (let len = 4, i = len; i > 0; i--) {
        if (
          fragment &&
          fragment.children &&
          fragment.children[0] &&
          fragment.children[0].children &&
          fragment.children[0].children[0]
        ) {
          headElement.appendChild(fragment.children[0].children[0]);
        }
      }
      let lightningAnchorElement = document.getElementById(
        "dh-lightning-reader-anchor"
      );

      fragment.children[1].children[0].appendChild(lightningAnchorElement);
      bodyElement.appendChild(fragment.children[1].children[0]);

      let newDocument = document.createElement("HTML");
      // probably create new tab here and close current one, tab ordering can be specified - chec google docs - so tab is replaced and immediatly active
      newDocument.appendChild(headElement);
      newDocument.appendChild(bodyElement);
      document.all[0].replaceWith(newDocument);
      const initialBodyStyles = `font-size: .5em`;
      document.body.style = initialBodyStyles;
      WebFont.load({
      google: {
        families: ['Titillium Web', 'sans-serif', 'VT323', 'Montserrat', 'Lato']
      }
    });
    }



    if (!formattedHTML) {
      return <span />;
    } else {


      return (
        <div>
          {
            <div
              className="lightning-full-page-dimmer"
              style={{
                position: "relative",
                boxShadow: `0 0 0 9999px rgba(0,0,0,${this.state.pageOpacity})`,
                zIndex: "999999999"
              }}
            />
          }
          <div className="ui container projects-view">
            {
              <div>
                {settingsButtons()}
                {this.state.settingsMenu && settingsMenu()}
                {/*   onClickOutside={handleOnClickOutsideFormatted} */}
                <div>
                  <Dimmer
                    page={true}
                    active={true}
                    style={{
                      background: this.state.backdropColour,
                      overflowY: "auto",
                      fontSize: '1.6em'
                    }}
                  >
                    <div onClick={this.handleStaticStateChange('clickDimCloseMenu', {
                      settingsMenu: false,
                      formatMenuInput: "previous:settingsMenu"
                    }, false, {
                        updateState: this.state.settingsMenu
                      })}>



                      <div
                        style={{
                          fontSize: `${this.state.fontSize}em`,
                          borderRadius: `${this.state.lightningTextEnabled ? '0.05em' : 'initial'}`,
                          background: this.state.backgroundColour,
                          color: this.state.lineGradientEnabled ? this.state.lineGradientHslValue.firstHexValue : this.state.fontColour
                        }}
                        className={`${this.state.lightningTextEnabled ? 'formatted-text-dim' : 'lightning-text-dim-hidden'} font-${this.state.fontFamily}`}>
                        <div style={{
                          background: this.state.backgroundColour,
                          color: this.state.lineGradientEnabled ? this.state.lineGradientHslValue.firstHexValue : this.state.fontColour
                        }}
                          className={`${this.state.lightningTextEnabled ? 'ui segment formatted-text' : 'lightning-formatted-text-hidden'}`}>
                          {this.state.lightningTextEnabled && lightningTextDisplay()}
                        </div>
                      </div>

                      <LightningArticleText
                        ref={el => (this.lightningArticleTextRef = el)}
                        activeTabUrl={this.props.lightning.activeTabUrl}
                        fontFamily={this.state.fontFamily}
                        lineGradientEnabled={this.state.lineGradientEnabled}
                        fontSize={this.state.fontSize}
                        lineHeight={this.state.lineHeight}
                        backgroundColour={this.state.backgroundColour}
                        colour={this.state.fontColour}
                        lightningTextEnabled={this.state.lightningTextEnabled}
                        formattedHTML={formattedHTML}
                        formattedText={formattedText}
                      >
                      </LightningArticleText>

                    </div>
                  </Dimmer>
                </div>
              </div>
            }
          </div>
        </div>
      );
    }
  }

}

// TODO: add link "Back to 'activeTabUrlString'" on page somewhere
const mapStateToProps = (state = {}, props = {}) => {
  if (!({ ...state }).activeTabUrl) {
    return { ...{ state }, ...{ props } }
  }
  return getVisibleLightningTextReaderState(state, props);
  //getVisibleLightningTextReaderStateSelector
};

const getLightningTextReaderState = (state, props) => {

  const activeTabUrl = (state || {}).activeTabUrl;
  const textItems = (state || {}).textItems;
  const textItem = textItems[activeTabUrl];
  const tabUrlsObject = (state || {}).tabUrls || {};
  const currentPageUrlString = document.URL;
  // TODO: i don't think this needs to be here - will need to remove, assuming im using re-select right, and if not, oh well, just remove it anyway
  const previousTextItems = (state || {}).previousTextItems || {};
  // TODO

  let currentTabActive = false;
  if (tabUrlsObject[activeTabUrl]) {
    if (tabUrlsObject[activeTabUrl].urlString === currentPageUrlString) {
      currentTabActive = true;
    }
  }

  return {
    tabUrls: tabUrlsObject,
    currentTabActive,
    activeTabUrl,
    currentPageUrlString,
    textItems,
    textItem,
    previousTextItems
  };
};

const getVisibleLightningTextReaderState = () => {
  return createCachedSelector([getLightningTextReaderState], lightning => {
    return { lightning };
  })(state => {
    // TODO: look into this
    return state.activeTabUrl;
  });
};

const mapDispatchToProps = dispatch => {
  return { dispatch };
};

export default connect(
  state => mapStateToProps(state),
  dispatch => mapDispatchToProps(dispatch)
)(App);

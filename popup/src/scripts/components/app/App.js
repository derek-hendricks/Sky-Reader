import React from 'react';

import { PureComponent } from 'react'
import {
  Button,
  Form,
  Header,
  HeaderContent,
  Segment
} from 'semantic-ui-react'


import { connect } from 'react-redux';

class App extends PureComponent {
  constructor(props) {
    super(props);

    this.formattedText = '';

    this.state = {
      displayTextItems: false,
      fullScreen: false,
      displayPreviousTextItemInfo: '',
      recoverCustomUserInput: ''
    }

    this.setStateEventHandler = this.setStateEventHandler.bind(this);
   // this.setDispatchEventHandler = this.setDispatchEventHandler.bind(this)

  }

  shouldComponentUpdate(nextProps, nextState) {

    if (nextState.displayTextItems !== this.state.displayTextItems) {
      return true;
    }
    if (nextState.fullScreen !== this.state.fullScreen) {
      return true;
    }
    if (nextState.displayPreviousTextItemInfo !== this.state.displayPreviousTextItemInfo) {
      return true;
    }
    if (nextState.recoverCustomUserInput !== this.state.recoverCustomUserInput) {
      return true;
    }
    return false
  }


  setStateEventHandler(stateProperty, updatedState, updatedFormatText, eventAction) {
    return (e) => {
      if (updatedFormatText) {
        this.formattedText = updatedFormatText;
      }
      this.setState((prevState) => {
        // if (prevState[stateProperty] !== updatedState) {
        return {
          [stateProperty]: updatedState
        }
        // }
      })
      if (eventAction) {
        return e[eventAction]();
      }
    }
  }


  render() {
    const displayTextUrls = (previousTextItems) => {
      return (
        <div>
          <div style={{
            maxHeight: '25em',
            overflowY: 'scroll'
          }}>
            <p
              className="lightning-display-popup-custom"
              style={{
                display: this.state.displayPreviousTextItemInfo && this.state.displayPreviousTextItemInfo.length ? 'block' : 'none'
              }}>
              {this.state.displayPreviousTextItemInfo}
            </p>
            <p className="ui text select-to-view-previous">
              Select to View in the Current Tab:
          </p>
            {Object.keys(previousTextItems).map((previousTextItemId) => {
              const previousTextItem = previousTextItems[previousTextItemId];
              const previousText = previousTextItem.text.trim();
              let popupContent = previousText.slice(0, 200);
              if (previousText.length > 200) {
                popupContent = popupContent.concat('... (more) ' + '[Words: ' + previousText.split(' ').length + ']');
              }

              return (
                <div style={{ position: 'relative' }}>

                  <span
                    className={'lightning-popup-remove-previous'}
                    onClick={(e) => {
                      this.props.dispatch({
                        type: 'REMOVE_PREVIOUS_TEXT_ITEM',
                        payload: {
                          url: previousTextItemId
                        }
                      });
                    }}
                  >
                    x
            </span>
                  <p
                    style={{
                      borderBottom: '1px dashed #d2d2d2',
                      borderBottomRightRadius: '2em',
                      borderTopLeftRadius: '0.4em',
                      paddingBottom: '1em',
                      padding: '1em',
                      margin: '1em',
                      fontWeight: '400'
                    }}
                    key={previousTextItemId}
                    className="ui text previousTextItem"

                    onMouseOver={(e) => {


                      if (this.state.displayPreviousTextItemInfo.length && this.state.displayPreviousTextItemInfo === popupContent) {
                        return;
                      }

                      this.setState(() => {
                        const displayPreviousTextItemInfo = popupContent;
                        return {
                          displayPreviousTextItemInfo
                        }
                      })
                      return e.preventDefault();
                    }}
                    onMouseOut={this.setStateEventHandler('displayPreviousTextItemInfo', '', false, 'preventDefault')}
                    onClick={(e) => {
                      const activeTabUrl = this.props.activeTabUrl;
                      const urlString = this.props.tabUrls[activeTabUrl].urlString;
                      const url = this.props.activeTabUrl;
                      const text = previousTextItem.text;

                      this.formattedText = 'sky-reader-extension-formatted';

                      this.props.dispatch({
                        type: 'NEW_TEXT_ITEM_WINDOW_UPDATED',
                        payload: {
                          text: text,
                          url: url,
                          urlString: urlString
                        }
                      });

                      window.close();
                      return e.stopPropagation();

                    }}
                  >
                    {previousTextItem.urlString.slice(0, this.state.fullScreen ? 70 : 38) + '..'}
                  </p>
                </div>

              );
            })}
          </div>
        </div>
      );
    };

    const recoverCustomInputText = () => {
      if (this.props.recoveredUserCustomTextInput.trim().length >= 1) {
        return (
          <a onClick={this.setStateEventHandler('recoverCustomUserInput',
            this.props.recoveredUserCustomTextInput,
            this.props.recoveredUserCustomTextInput,
            'preventDefault'
          )}>
            Recover your text
        </a>
        )
      } else {
        return <span></span>
      }


    }

    const formatForm = () => {
      return (
        <div className="format">
          <Header className="popup-lightning-window-header-text">
            <HeaderContent>
              Sky Reader
              </HeaderContent>
          </Header>
          <p className="ui text popup-lightning-text">
            Select "Format" below to format the text on this page
          </p>
          <Segment>
            <p className="type-paste-to-view-lightning">
              You can also type or copy and paste something in the input field below. Any text entered will be formatted in the active tab instead of the current webpage's text.
            </p>
            <div className="format-form" style={{ position: "relative" }}>
              <div className={'format-form-expand-popup-container'} style={{ marginBottom: '.5em' }}>
                <a className={'ui format-form-expand-popup'}
                  onClick={(e) => {
                    this.setState((prevState) => {
                      return {
                        fullScreen: !prevState.fullScreen
                      }
                    })

                  }}>{this.state.fullScreen ? 'Default View' : 'Expanded View'}
                </a>
                <br />
                {recoverCustomInputText()}

              </div>
              <Form>
                <Form.TextArea
                  style={{ width: this.state.fullScreen ? '97.5%' : '27em', padding: '0.5em' }}
                  value={this.state.recoverCustomUserInput}
                  placeholder='Enter custom text to format (optional)'
                  onChange={({ target: { value } }) => {

                    this.formattedText = value;

                    this.setState(() => {
                      return {
                        recoverCustomUserInput: this.formattedText
                      }
                    })
                  }}>

                </Form.TextArea>
              </Form>
            </div>

            <div className="format-decode-button">
              <Button style={{ width: '100%', backgroundColor: '#77828a', marginTop: '0.5em', marginBottom: '1em', fontSize: '1.25em', padding: '1em', color: '#fff' }}
                className="ui button huge primary lightning-format-window-button"
                onClick={(e) => {
                  const activeTabUrl = this.props.activeTabUrl;
                  if (this.props.tabUrls[activeTabUrl]) {
                    const urlString = this.props.tabUrls[activeTabUrl].urlString;
                    const customUserFormatted = this.formattedText.trim();

                    function sanitizeInput(input) {
                      return input.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
                    }

                    // if (customUserFormatted.length) {

                    // }
                    // const sanitizedValue = sanitizeInput(customUserFormatted);

                    const textToFormat = customUserFormatted.length ?
                      sanitizeInput(customUserFormatted) :
                      'default-web-article-content';

                    this.formattedText = 'sky-reader-extension-formatted';

                    this.props.dispatch({
                      type: 'NEW_TEXT_ITEM_WINDOW_UPDATED',
                      payload: {
                        text: textToFormat,
                        url: activeTabUrl,
                        urlString
                      }
                    }
                    );
                  }
                  window.close();

                }
                }>
                Format
                </Button>
            </div>

          </Segment>

          <p className="ui text popup-lightning-text" style={{
            display: this.state.displayTextItems && this.props.previousTextItemKeys.length > 0 ? 'block' : 'none',
            paddingTop: '1.5em'
          }}>
            Recently Formatted Text Items
           </p>

          <Segment style={{
            display: this.props.previousTextItemKeys.length > 0 ? "inherit" : "none",
            marginBottom: '1em'
          }}>

            <Button className="ui button basic lightning-reader-popup-view-recent-button" style={{
              display: (this.props.previousTextItemKeys.length > 0) && this.state.displayTextItems === false ? "inherit" : "none",
              width: '100%',
              background: 'none',
              padding: '.5em'
            }}
              onClick={e => {
                this.setState(prevState => {
                  return {
                    displayTextItems: true
                  };
                });
              }}
            >
              View Recently Formatted Texts
  </Button>

            <div style={{
              display: this.state.displayTextItems ? "initial" : "none"
            }}>
              {this.state.displayTextItems && displayTextUrls(this.props.previousTextItems)}
            </div>
          </Segment>
        </div>
      )
    };
    return (
      <div
        className={`ui container lightning-reader-uni-extension projects-view ${this.state.fullScreen ? 'full-screen' : 'default-screen'}`}
        style={{ maxWidth: '25em !important' }}
        onMouseOut={() => {

          if (this.formattedText.trim().length && this.formattedText !== 'sky-reader-extension-formatted') {
            // TODO: and if (this.state.recoveredUserCustomTextInput && this.state.recoveredUserCustomTextInput !== this.formattedText) {
            this.props.dispatch({
              type: 'CUSTOM_USER_TEXT',
              payload: {
                text: this.formattedText,
                url: this.props.activeTabUrl,
                urlString: this.props.tabUrls[this.props.activeTabUrl].urlString
              }
            }
            );
            // TODO: and if (this.state.recoveredUserCustomTextInput && this.state.recoveredUserCustomTextInput !== this.formattedText) {
            // TODO: }
          }


        }}
      >
        {<div>
          {formatForm()}
        </div>}

      </div>
    );
  }
}


// TODO: maybe use re-select. but first find out if its even being used properly
const mapStateToProps = (state) => {
  const { textItems, previousTextItems, customTexts } = state;
  const activeTabUrl = state.activeTabUrl;

  let recoveredUserCustomTextInput = '';
  if (customTexts[activeTabUrl]) {
    recoveredUserCustomTextInput = customTexts[activeTabUrl].text;
  }

  const previousTextItemKeys = Object.keys(previousTextItems);

  return {
    activeTabUrl: activeTabUrl,
    tabUrls: state.tabUrls,
    textItems: textItems,
    previousTextItems: previousTextItems,
    previousTextItemKeys: previousTextItemKeys,
    recoveredUserCustomTextInput
  };
};

const mapDispatchToProps = (dispatch) => ({ dispatch });

export default connect(
  (state) => mapStateToProps(state),
  (dispatch) => mapDispatchToProps(dispatch)
)(App);

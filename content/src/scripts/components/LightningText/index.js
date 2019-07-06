import React from 'react';

import { PureComponent } from 'react'
import { connect } from "react-redux";
import {
  Grid,
  Card,
  Button
} from 'semantic-ui-react'


// TODO: rename index or remove
let index;
const defaultLightningSpeed = 1.7;

class LightningText extends PureComponent {
  constructor(props) {
    super(props);
    this.lightningTimeout = null;
    this.state = {
      activeWord: '',
      activeWordIndex: 0,
      lightningSpeed: null,
      lightningWordsPerCard: 1,
      lightningCardBackgroundColour: 'rgba(0, 0, 0, 0.1)',
      lightningCardFontFamily: 'garamond',
      lightningCardContentBackgroundColor: 'background: rgba(46, 46, 46, 0.48) !important',
      lightningTransitions: false,
      pause: false
    };
  }

  componentWillUnmount() {
    clearTimeout(this.lightningTimeout);
  }

  componentDidMount() {
    this.startLightningReader();
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (this.state.pause !== nextState.pause) {
      return true;
    }
    if (this.props.fontSize !== nextProps.fontSize) {
      return true;
    }
    if (this.state.lightningTransitions !== nextState.lightningTransitions) {
      return true;
    }
    if (this.state.lightningCardContentBackgroundColor !== nextState.lightningCardContentBackgroundColor) {
      return true;
    }
    if (+this.state.activeWordIndex !== +nextState.activeWordIndex) {
      return true;
    }
    if (this.state.activeWord !== nextState.activeWord) {
      return true;
    }
    if (+(+this.state.lightningSpeed).toFixed(1) !== +(+nextState.lightningSpeed).toFixed(1)) {
      return true;
    }
    if (+this.state.lightningWordsPerCard !== +nextState.lightningWordsPerCard) {
      return true;
    }
    if (this.state.lightningCardBackgroundColour !== nextState.lightningCardBackgroundColour) {
      return true;
    }

    return this.state.lightningCardFontFamily !== nextState.lightningCardFontFamily;
  }

  render() {
    const previousIndex = index;
    // TODO: do something about this
    index = this.state.activeWordIndex;


    const lightningCardText = () => {
      return (
        <div>
          <p className='lightning-card-text'
             style={{
              fontSize: `${this.props.fontSize}em`,
               color: this.props.fontColour,
               paddingBottom: '.5em'
             }}>
            {this.state.activeWord}
          </p>
       
        </div>
      )
    };

    return (
      <div className='lightning-text' style={{minWidth:'61em'}}>
        <div className={`font-${this.state.lightningCardFontFamily}`}>
          <div className='lightning-card' style={{
            background: this.state.lightningCardBackgroundColour,
            paddingTop: '3.5em',
            marginBottom: '4em',
            paddingBottom: '3.5em',
            borderRadius: '.28571429rem',
            borderTopLeftRadius: '0.285714rem',
            borderTopRightRadius: '0.285714rem',
            borderBottomRightRadius: '0.285714rem',
            borderBottomLeftRadius: '0.285714rem'
          }}>
            <Grid>
              <Grid.Row>
                <Grid.Column width={16}>
                  <Card className={'lightning-text-card'} style={{
                    minWidth: '53em',
                    textAlign: 'center',
                    marginLeft: 'auto',
                    marginRight: 'auto',
                    background: 'rgba(0,0,0,0) !important',
                    boxShadow: 'none'
                  }}>
                    <Card.Content style={{
                      paddingTop: '1.5em !important',
                      paddingBottom: '1.5em !important'
                    }}>
                      <div className='lightning-card-text-container'>
                        {lightningCardText()}
                      </div>
                    </Card.Content>
                  </Card>
                </Grid.Column>
              </Grid.Row>
              <Grid.Row>
                <Grid.Column width={16}>
                    {/* {lightningCardStyleOptions()} */}
                    <Button
            size="small"
            className={'lightning-text-pause-button'}
            style={{    color: "rgb(0, 0, 0)",
    top: "0px!important",
    background: "rgba(255, 255, 255, 0.8)!important",
    padding: "0.85em!important"}}
            icon={false}
            secondary
            labelPosition='right'
            onClick={(e) => {
              this.setState((prevState) => {
                const pause = !prevState.pause;
                return {
                  pause
                };
              }, () => {
                if (!this.state.pause) {
                  this.startLightningReader();
                }
              });
              return e.stopPropagation();
            }}>
        
            {this.state.pause ? 'Play' : 'Pause'}
          </Button>
        
          <Button
            size="small"
            className={'slower-lightning-button'}
            style={{    color: "rgb(0, 0, 0)",
    top: "0px!important",
    background: "rgba(255, 255, 255, 0.8)!important",
    padding: "0.85em!important"}}
            icon={false}
            id={'faster-lightning-button'}
            secondary
            labelPosition='right'
            onClick={(e) => {
              // let btn = document.getElementById('faster-lightning-button');
              // btn.style.backgroundColor = '#1b1c1d';
              this.setState((prevState) => {
                const lightningSpeed = prevState.lightningSpeed;
                let updatedLightningSpeed;
                if (!lightningSpeed) {
                  updatedLightningSpeed = +(+(defaultLightningSpeed).toFixed(1) + .1).toFixed(1);
                } else {
                  updatedLightningSpeed = +(+(lightningSpeed).toFixed(1) + .1).toFixed(1);
                }
                return {
                  lightningSpeed: updatedLightningSpeed
                };
              }, () => {
                this.startLightningReader();
              });
              return e.stopPropagation();
            }}>
      
            
            Slower
          </Button>
          <Button
            size="small"
            style={{    color: "rgb(0, 0, 0)",
    top: "0px!important",
    background: "rgba(255, 255, 255, 0.8)!important",
    padding: "0.85em!important"}}
            className={'faster-lightning-button'}
            id={'slower-lightning-button'}
            icon={false}
            active={false}
            secondary
            labelPosition='right'
            onClick={(e) => {
              // let btn = document.getElementById('slower-lightning-button')
              // btn.style.backgroundColor = '#1b1c1d';
              this.setState((prevState) => {
                const lightningSpeed = prevState.lightningSpeed;
                let updatedLightningSpeed;
                if (!lightningSpeed) {
                  updatedLightningSpeed = +(+(defaultLightningSpeed).toFixed(1) - .1).toFixed(1);
                } else {
                  updatedLightningSpeed = +(+(lightningSpeed).toFixed(1) - .1).toFixed(1);
                }
                return {
                  lightningSpeed: updatedLightningSpeed
                };
              }, () => {
                this.startLightningReader();
              });
              return e.preventDefault();
            }}>
       
         
            Faster
          </Button>
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </div>
        </div>
      </div>
    )
  }

  startLightningReader() {
    const { lightningWordsPerCard, lightningSpeed } = this.state;
    const lightningSpeedProp = (this.props || {}).lightningSpeed || defaultLightningSpeed;
    const speed = lightningSpeed ? lightningSpeed * 100 : lightningSpeedProp * 100;

    // todo: move to componentDidMount . shouldn't be calling every time speed changes
    // todo: on new paragraphs, increase speed 3.5 or more
    // todo: give user option to set wordsPerCard, pass it in as a prop and allow for change in LightningText component
    const lightningWordsArray = (lightningText, wordsPerCard) => {
      if (wordsPerCard > 1) {
        const words = wordsPerCard - 1;
        const regExpString = `\\b[\\w']+(?:[^\\w\\n]+[\\w']+){0,${words}}\\n\\b`;
        const wordsSeparatedBySpacesRegExp = new RegExp(regExpString, 'g');
        return lightningText.match(wordsSeparatedBySpacesRegExp).filter((word) => word !== '\n');
      } else {
        return lightningText.split(/\n|\s/g).filter((word) => word !== '');
      }
    };

    const setWordTransitionSpeed = (transitionSpeed) => {
      const nextWord = (textArray[ this.state.activeWordIndex ] || '').trim();
      const lastChar = nextWord[ nextWord.length - 1 ];

      const isEndOfSentence = new RegExp(".*[.!?;]").test(nextWord);
      if (isEndOfSentence) {
        return transitionSpeed * 3.5;
      }

      const precedesMidSentencePunctuation = new RegExp(",*[,:]").test(nextWord);
      if (precedesMidSentencePunctuation) {
        return transitionSpeed * 2.25;
      }

      const wordContainsDash = new RegExp("-").test(nextWord);
      if (wordContainsDash) {
        return transitionSpeed * 2;
      }

      const hasQuotes = new RegExp(`&rsquo;|&lsquo;|&rdquo;|&ldquo;|'|"|”`).test(lastChar);
      if (hasQuotes) {
        const isWordEnclosedByQuotationMarks = new RegExp(".*[.!?;]").test(nextWord[ nextWord.length - 2 ]);
        if (isWordEnclosedByQuotationMarks) {
          return transitionSpeed * 3.5;
        }
      }
      return speed;
    };

    const electrifyTimeout = (indexCount, textArray, speed) => {
      const cardCount = textArray.length;
      if (indexCount < cardCount) {
        const wordTransitionSpeed = setWordTransitionSpeed(speed);

        this.lightningTimeout = setTimeout(() => {
          let counter = indexCount + 1;

          return this.setState((prevState) => {
            const { activeWordIndex: previousActiveWordIndex } = prevState;
            const newActiveWordIndex = previousActiveWordIndex + 1;
            const activeWord = textArray[ newActiveWordIndex ];

            if (newActiveWordIndex < cardCount && activeWord) {
              return {
                activeWord,
                activeWordIndex: newActiveWordIndex
              }
            }
          }, () => {
            clearTimeout(this.lightningTimeout);
            if (counter < cardCount && !this.state.pause) {
                if (this.state.lightningSpeed) {
                  const lSpeed = this.state.lightningSpeed;
                  if (lSpeed * 100 !== speed) {
                    return;
                  }
                
              }
              return electrifyTimeout(counter, textArray, speed);
            }
          });
        }, wordTransitionSpeed);
      }
    };

    const textArray = lightningWordsArray(this.props.text, lightningWordsPerCard);

    this.setState(() => {
      return {
        activeWord: textArray[ this.state.activeWordIndex ]
      }
    }, () => {
      clearTimeout(this.lightningTimeout);
      electrifyTimeout(this.state.activeWordIndex, textArray, speed);
    });
  }
}

const mapStateToProps = (state, props) => {
  return { ...{ state }, ...{ props } };
};

export default connect(mapStateToProps)(LightningText);


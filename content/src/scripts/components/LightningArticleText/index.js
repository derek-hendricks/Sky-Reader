import React from 'react';

import { PureComponent } from 'react'
import { connect } from "react-redux";

class LightningArticleText extends PureComponent {
  constructor(props) {
    super(props);
   
  }


  render() {
    return (
      <div 
      className={`${!this.props.lightningTextEnabled ? 'formatted-text-dim' : 'formatted-text-dim-hidden'} font-${this.props.fontFamily}`}
      >
        <div 
        className={`${!this.props.lightningTextEnabled ? 'ui segment formatted-text' : 'formatted-text-hidden'}`}
        
        >
       {/* todo: add as option -> color: rgb(251, 255, 251); opacity: 0.3;*/}
       <div className={`format-paragraphs-direct-copy ${
                            this.props.lineGradientEnabled
                              ? `line-gradients-enabled`
                              : "line-gradients-disabled"
                            }`}
                          style={{
                            fontSize: this.props.fontSize + 'em',
                            lineHeight: this.props.lineHeight,
                            background: this.props.backgroundColour,
                            boxShadow: "none !important",
                            color: this.props.colour,
                            paddingLeft: this.props.lightningTextEnabled ? 'initial' : '3em',
                            paddingTop: this.props.lightningTextEnabled ? 'initial' : '3em'
                          }}
                        >

                          {!this.props.lightningTextEnabled && this.props.formattedHTML}
                        </div>
      </div>
</div>

        
    )
  }

 
}

const mapStateToProps = (state, props) => {
  return { ...{ state }, ...{ props } };
};

export default connect(mapStateToProps)(LightningArticleText);


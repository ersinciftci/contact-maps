/**
 * In this file, we create a React component
 * which incorporates components provided by Material-UI.
 */
import React, {Component} from 'react';
import AutoComplete from 'material-ui/AutoComplete';
import {deepOrange500} from 'material-ui/styles/colors';
import FlatButton from 'material-ui/FlatButton';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

const styles = {
  container: {
    textAlign: 'center',
    paddingTop: 200,
  },
};

const muiTheme = getMuiTheme({
  palette: {
    accent1Color: deepOrange500,
  },
});

class Main extends Component {

  constructor(props, context) {
    super(props, context);
    this.onButtonClick = this.onButtonClick.bind(this);
    this.onTextChange = this.onTextChange.bind(this);
    this.onNewRequest = this.onNewRequest.bind(this);
    this.updateText = this.updateText.bind(this);
    this.state = {text: "", disabled: true,
      datasource: ["PF00028", "PF00029", "PF00030", "PF00031", "PF00032", "PF00033", "PF00034"]};
  }

  onButtonClick() {
    window.location = "pdf_files/" + this.state.text + "_lh0.01_le16.0_min_min.pdf";
  }

  updateText(text) {
    this.state.text = text;

    if (this.state.datasource.indexOf(text) > -1) {
      this.state.disabled = false;
    } else {
      this.state.disabled = true;
    }

    this.setState(this.state);
  }

  onTextChange(searchText, dataSource) {
    this.updateText(searchText);
  }

  onNewRequest(chosenRequest, index) {
    this.updateText(chosenRequest);
  }

  render() {
    return (
      <MuiThemeProvider muiTheme={muiTheme}>
        <div style={styles.container}>
          <h1>Contact Maps</h1>
          <AutoComplete
              floatingLabelText="PFAM ID"
              filter={AutoComplete.caseInsensitiveFilter}
              openOnFocus={true}
              dataSource={this.state.datasource}
              onUpdateInput={this.onTextChange}
              onNewRequest={this.onNewRequest}
              maxSearchResults={5}
          />
          <FlatButton secondary={true} label="Open PDF" onClick={this.onButtonClick} disabled={this.state.disabled}/>
        </div>
      </MuiThemeProvider>
    );
  }
}

export default Main;

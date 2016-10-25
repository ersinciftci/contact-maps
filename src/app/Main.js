/**
 * In this file, we create a React component
 * which incorporates components provided by Material-UI.
 */
import React, {Component} from 'react';
import AutoComplete from 'material-ui/AutoComplete';
import TextField from 'material-ui/TextField';
import {deepOrange500} from 'material-ui/styles/colors';
import FlatButton from 'material-ui/FlatButton';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import axios from 'axios';

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
    this.onPfamButtonClick = this.onPfamButtonClick.bind(this);
    this.onPdbButtonClick = this.onPdbButtonClick.bind(this);
    this.onPdbChange = this.onPdbChange.bind(this);
    this.onUniProtAccButtonClick = this.onUniProtAccButtonClick.bind(this);
    this.onUniProtAccChange = this.onUniProtAccChange.bind(this);
    this.onUniProtIdButtonClick = this.onUniProtIdButtonClick.bind(this);
    this.onUniProtIdChange = this.onUniProtIdChange.bind(this);
    this.onInterProButtonClick = this.onInterProButtonClick.bind(this);
    this.onInterProChange = this.onInterProChange.bind(this);
    this.onTextChange = this.onTextChange.bind(this);
    this.onNewRequest = this.onNewRequest.bind(this);
    this.updateText = this.updateText.bind(this);
    this.state = {pfam: "", pdb: "", uniprotAcc: "", uniprotId: "", interpro: "", disabled: true,
      datasource: ["PF00028", "PF00029", "PF00030", "PF00031", "PF00032", "PF00033", "PF00034"]};
  }

  onPfamButtonClick() {
    window.location = "pdf_files/" + this.state.pfam + "_lh0.01_le16.0_min_min.pdf";
  }

  onPdbButtonClick() {

    axios.get('https://www.ebi.ac.uk/pdbe/api/mappings/pfam/' + this.state.pdb)
        .then(response => {
          this.updateText(Object.keys(response.data[this.state.pdb]['Pfam'])[0]);
        })
        .catch(function (error) {
          console.log(error);
        });
  }

  onPdbChange(event) {

    this.state.pdb = event.target.value;
  }

  onUniProtAccButtonClick() {

    axios.get('https://www.ebi.ac.uk/pdbe/api/mappings/uniprot_to_pfam/' + this.state.uniprotAcc)
        .then(response => {
          this.updateText(Object.keys(response.data[this.state.uniprotAcc]['Pfam'])[0]);
        })
        .catch(function (error) {
          console.log(error);
        });
  }

  onUniProtAccChange(event) {

    this.state.uniprotAcc = event.target.value;
  }

  onUniProtIdButtonClick() {

  }

  onUniProtIdChange(event) {

    this.state.uniprotId = event.target.value;
  }

  onInterProButtonClick() {

  }

  onInterProChange(event) {

    this.state.interpro = event.target.value;
  }


  updateText(text) {
    this.state.pfam = text;

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
          <div>
            <AutoComplete
                floatingLabelText="PFAM ID"
                filter={AutoComplete.caseInsensitiveFilter}
                openOnFocus={true}
                dataSource={this.state.datasource}
                onUpdateInput={this.onTextChange}
                onNewRequest={this.onNewRequest}
                maxSearchResults={5}
                searchText={this.state.pfam}
            />
            <FlatButton secondary={true} label="Open PDF" onClick={this.onPfamButtonClick} disabled={this.state.disabled}/>
          </div>
          <div>OR</div>
          <div>
            <TextField hintText="PDB ID" onChange={this.onPdbChange}/>
            <FlatButton secondary={true} label="Fetch PFAM ID" onClick={this.onPdbButtonClick}/>
            <br />
            <TextField hintText="UniProt Accession" onChange={this.onUniProtAccChange}/>
            <FlatButton secondary={true} label="Fetch PFAM ID" onClick={this.onUniProtAccButtonClick}/>
            <br />
            <TextField hintText="UniProt Identifier" onChange={this.onUniProtIdChange}/>
            <FlatButton secondary={true} label="Fetch PFAM ID" onClick={this.onUniProtIdButtonClick}/>
            <br />
            <TextField hintText="InterPro Accession" onChange={this.onInterProChange}/>
            <FlatButton secondary={true} label="Fetch PFAM ID" onClick={this.onInterProButtonClick}/>
            <br />
          </div>
        </div>
      </MuiThemeProvider>
    );
  }
}

export default Main;

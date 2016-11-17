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
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';

const styles = {
  container: {
    textAlign: 'center',
  },
  customWidth: {
    width: 200,
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
    this.onTextChange = this.onTextChange.bind(this);
    this.onNewRequest = this.onNewRequest.bind(this);
    this.updateText = this.updateText.bind(this);
    this.handleAccessionChange = this.handleAccessionChange.bind(this);
    this.state = {pfam: "", pdb: "", disabled: true, value: 1, hintText: "PDB ID", url : "",
      datasource: ["PF00028", "PF00029", "PF00030", "PF00031", "PF00032", "PF00033", "PF00034"]};
  }

  handleAccessionChange(event, index, value) {

    if (value == 1) {
      this.state.hintText = "PDB ID";
    }  else if (value == 2) {
      this.state.hintText = "UniProt Accession";
    } else if (value == 3) {
      this.state.hintText = "UniProt Identifier";
    } else if (value == 4) {
      this.state.hintText = "InterPro Accession";
    }

    this.state.value = value;
    this.state.pdb = "";
    this.setState(this.state);
  }

  onPfamButtonClick() {
    this.state.url = "png/" + this.state.pfam + "_lh0.01_le16.0_med_min.png";
    this.setState(this.state);
  }

  onPdbButtonClick() {

    var value = this.state.value;
    if(value == 1) {
      axios.get('https://www.ebi.ac.uk/pdbe/api/mappings/pfam/' + this.state.pdb)
          .then(response => {
            this.updateText(Object.keys(response.data[this.state.pdb]['Pfam'])[0]);
          })
          .catch(function (error) {
            console.log(error);
          });
    } else if (value == 2) {
      axios.get('https://www.ebi.ac.uk/pdbe/api/mappings/uniprot_to_pfam/' + this.state.pdb)
          .then(response => {
            this.updateText(Object.keys(response.data[this.state.pdb]['Pfam'])[0]);
          })
          .catch(function (error) {
            console.log(error);
          });
    } else if (value == 3) {
      axios.get('http://www.uniprot.org/uniprot/' + this.state.pdb + '.xml')
          .then(response => {
            var parser = new DOMParser();
            var doc = parser.parseFromString(response.data, "application/xml");
            var uniprotAcc = doc.documentElement.childNodes[1].childNodes[1].textContent;
            axios.get('https://www.ebi.ac.uk/pdbe/api/mappings/uniprot_to_pfam/' + uniprotAcc)
                .then(response => {
                  this.updateText(Object.keys(response.data[uniprotAcc]['Pfam'])[0]);
                })
                .catch(function (error) {
                  console.log(error);
                });
          })
          .catch(function (error) {
            console.log(error);
          });
    } else if (value == 4) {
      axios.get('https://www.ebi.ac.uk/pdbe/api/mappings/' + this.state.pdb)
          .then(response => {
            var interProAcc = Object.keys(response.data[this.state.pdb]['PDB'])[0];
            axios.get('https://www.ebi.ac.uk/pdbe/api/mappings/pfam/' + interProAcc)
                .then(response => {
                  this.updateText(Object.keys(response.data[interProAcc]['Pfam'])[0]);
                })
                .catch(function (error) {
                  console.log(error);
                });
          })
          .catch(function (error) {
            console.log(error);
          });
    }
  }

  onPdbChange(event) {

    this.state.pdb = event.target.value;
    this.setState(this.state);
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
            <FlatButton secondary={true} label="Open Map" onClick={this.onPfamButtonClick} disabled={this.state.disabled}/>
          </div>
          <div>OR</div>
          <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
            <div style={{ marginRight: 10}}>
              <SelectField
                  value={this.state.value}
                  onChange={this.handleAccessionChange}
                  style={styles.customWidth}
              >
                <MenuItem value={1} primaryText="PDB ID" />
                <MenuItem value={2} primaryText="UniProt Accession" />
                <MenuItem value={3} primaryText="UniProt Identifier" />
                <MenuItem value={4} primaryText="InterPro Accession" />
              </SelectField>
            </div>
            <div>
              <TextField hintText={this.state.hintText} value={this.state.pdb} onChange={this.onPdbChange}/>
              <FlatButton secondary={true} label="Fetch PFAM ID" onClick={this.onPdbButtonClick}/>
              <br />
            </div>
          </div>
          <div>
            <img src={this.state.url} width="680" style={{display: this.state.url == '' ? 'none' : ''}}/>
          </div>
        </div>
      </MuiThemeProvider>
    );
  }
}

export default Main;

/**
 * In this file, we create a React component
 * which incorporates components provided by Material-UI.
 */
import React, {Component} from 'react';;
import TextField from 'material-ui/TextField';
import {deepOrange500} from 'material-ui/styles/colors';
import FlatButton from 'material-ui/FlatButton';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import axios from 'axios';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import RefreshIndicator from 'material-ui/RefreshIndicator';

const styles = {
  container: {
    textAlign: 'center',
  },
  customWidth: {
    width: 200,
  },
  refresh: {
    display: 'inline-block',
    position: 'relative',
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
    this.updateText = this.updateText.bind(this);
    this.handleAccessionChange = this.handleAccessionChange.bind(this);
    this.onStateReady = this.onStateReady.bind(this);
    this.state = {pfam: "", pdb: "", value: 1, hintText: "PDB ID", url : "", imageHidden: false, refresh: "hide"};
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
    axios.get(this.state.url)
        .then(response => {
          this.state.imageHidden = false;
          this.setState(this.state);
        })
        .catch(error => {
          this.state.imageHidden = true;
          this.setState(this.state);
        });
  }

  onPdbButtonClick() {

    this.state.refresh = "loading";
    this.setState(this.state);
    var value = this.state.value;
    if(value == 1) {
      axios.get('https://www.ebi.ac.uk/pdbe/api/mappings/pfam/' + this.state.pdb)
          .then(response => {
            this.onStateReady();
            this.updateText(Object.keys(response.data[this.state.pdb]['Pfam'])[0]);
          })
          .catch(error => {
            this.onStateReady();
            console.log(error);
          });
    } else if (value == 2) {
      axios.get('https://www.ebi.ac.uk/pdbe/api/mappings/uniprot_to_pfam/' + this.state.pdb)
          .then(response => {
            this.onStateReady();
            this.updateText(Object.keys(response.data[this.state.pdb]['Pfam'])[0]);
          })
          .catch(error => {
            this.onStateReady();
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
                  this.onStateReady();
                  this.updateText(Object.keys(response.data[uniprotAcc]['Pfam'])[0]);
                })
                .catch(error => {
                  this.onStateReady();
                  console.log(error);
                });
          })
          .catch(error => {
            this.onStateReady();
            console.log(error);
          });
    } else if (value == 4) {
      axios.get('https://www.ebi.ac.uk/pdbe/api/mappings/' + this.state.pdb)
          .then(response => {
            var pdbId = Object.keys(response.data[this.state.pdb]['PDB'])[0];
            axios.get('https://www.ebi.ac.uk/pdbe/api/mappings/pfam/' + pdbId)
                .then(response => {
                  this.onStateReady();
                  this.updateText(Object.keys(response.data[pdbId]['Pfam'])[0]);
                })
                .catch(error => {
                  this.onStateReady();
                  console.log(error);
                });
          })
          .catch(error => {
            this.onStateReady();
            console.log(error);
          });
    }
  }

  onStateReady() {
    this.state.refresh = "hide";
    this.setState(this.state);
  }

  onPdbChange(event) {

    this.state.pdb = event.target.value;
    this.setState(this.state);
  }

  updateText(text) {
    this.state.pfam = text;
    this.setState(this.state);
  }

  onTextChange(event) {
    this.updateText(event.target.value);
  }

  render() {
    return (
      <MuiThemeProvider muiTheme={muiTheme}>
        <div style={styles.container}>
          <h1>Contact Maps</h1>
          <div>
            <TextField hintText="PFAM ID" value={this.state.pfam} onChange={this.onTextChange}/>
            <FlatButton secondary={true} label="Open Map" onClick={this.onPfamButtonClick}/>
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
            <div>
              <RefreshIndicator
                  size={35}
                  left={20}
                  top={5}
                  loadingColor="#FF9800"
                  status={this.state.refresh}
                  style={styles.refresh}
              />
            </div>
          </div>
          <div>
            <img src={this.state.url} width="680" style={{display: (this.state.url == '' || this.state.imageHidden) ? 'none' : ''}}/>
            <h2 style={{display: !this.state.imageHidden ? 'none' : ''}}>Contact map not found.</h2>
          </div>
        </div>
      </MuiThemeProvider>
    );
  }
}

export default Main;

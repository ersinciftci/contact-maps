/**
 * In this file, we create a React component
 * which incorporates components provided by Material-UI.
 */
import React, {Component} from 'react';
import TextField from 'material-ui/TextField';
import {deepOrange500} from 'material-ui/styles/colors';
import FlatButton from 'material-ui/FlatButton';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import axios from 'axios';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import RefreshIndicator from 'material-ui/RefreshIndicator';
import {browserHistory} from 'react-router';
import {Table, Column, Cell} from 'fixed-data-table';
import Dialog from 'material-ui/Dialog';
import {RadioButton, RadioButtonGroup} from 'material-ui/RadioButton';

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
        this.onFilterChange = this.onFilterChange.bind(this);
        this.handleOpen = this.handleOpen.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleRadioButtonChange = this.handleRadioButtonChange.bind(this);
        this.state = {
            pfam: "", pdb: "", value: 1, hintText: "PDB ID", url: "", imageHidden: false, refresh: "hide",
            pfamList: pfamList, open : false, retrievedPfams : [], valueSelected : ""
        };

        if (this.props.params.pfamId) {
            this.state.pfam = this.props.params.pfamId;
            this.onPfamButtonClick();
        }
    }

    handleAccessionChange(event, index, value) {

        if (value == 1) {
            this.state.hintText = "PDB ID";
        } else if (value == 2) {
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
                browserHistory.push('/contact-maps/' + this.state.pfam);
                this.setState(this.state);
            })
            .catch(error => {
                this.state.imageHidden = true;
                browserHistory.push('/contact-maps/' + this.state.pfam);
                this.setState(this.state);
            });
    }

    onPdbButtonClick() {

        this.state.refresh = "loading";
        this.setState(this.state);
        let value = this.state.value;
        if (value == 1) {
            axios.get('https://www.ebi.ac.uk/pdbe/api/mappings/pfam/' + this.state.pdb)
                .then(response => {
                    this.state.retrievedPfams = Object.keys(response.data[this.state.pdb]['Pfam']);
                    if(this.state.retrievedPfams.length > 1) {
                        this.handleOpen();
                    } else {
                        this.updateText(this.state.retrievedPfams[0]);
                        this.onStateReady();
                    }
                })
                .catch(error => {
                    this.updateText('');
                    this.onStateReady();
                    console.log(error);
                });
        } else if (value == 2) {
            axios.get('https://www.ebi.ac.uk/pdbe/api/mappings/uniprot_to_pfam/' + this.state.pdb)
                .then(response => {
                    this.state.retrievedPfams = Object.keys(response.data[this.state.pdb]['Pfam']);
                    if(this.state.retrievedPfams.length > 1) {
                        this.handleOpen();
                    } else {
                        this.updateText(this.state.retrievedPfams[0]);
                        this.onStateReady();
                    }
                })
                .catch(error => {
                    this.updateText('');
                    this.onStateReady();
                    console.log(error);
                });
        } else if (value == 3) {
            axios.get('http://www.uniprot.org/uniprot/' + this.state.pdb + '.xml')
                .then(response => {
                    let parser = new DOMParser();
                    let doc = parser.parseFromString(response.data, "application/xml");
                    let uniprotAcc = doc.documentElement.childNodes[1].childNodes[1].textContent;
                    axios.get('https://www.ebi.ac.uk/pdbe/api/mappings/uniprot_to_pfam/' + uniprotAcc)
                        .then(response => {
                            this.state.retrievedPfams = Object.keys(response.data[uniprotAcc]['Pfam']);
                            if(this.state.retrievedPfams.length > 1) {
                                this.handleOpen();
                            } else {
                                this.updateText(this.state.retrievedPfams[0]);
                                this.onStateReady();
                            }
                        })
                        .catch(error => {
                            this.updateText('');
                            this.onStateReady();
                            console.log(error);
                        });
                })
                .catch(error => {
                    this.updateText('');
                    this.onStateReady();
                    console.log(error);
                });
        } else if (value == 4) {
            axios.get('https://www.ebi.ac.uk/pdbe/api/mappings/' + this.state.pdb)
                .then(response => {
                    let pdbId = Object.keys(response.data[this.state.pdb]['PDB'])[0];
                    axios.get('https://www.ebi.ac.uk/pdbe/api/mappings/pfam/' + pdbId)
                        .then(response => {
                            this.state.retrievedPfams = Object.keys(response.data[pdbId]['Pfam']);
                            if(this.state.retrievedPfams.length > 1) {
                                this.handleOpen();
                            } else {
                                this.updateText(this.state.retrievedPfams[0]);
                                this.onStateReady();
                            }
                        })
                        .catch(error => {
                            this.updateText('');
                            this.onStateReady();
                            console.log(error);
                        });
                })
                .catch(error => {
                    this.updateText('');
                    this.onStateReady();
                    console.log(error);
                });
        }
    }

    onStateReady() {
        this.state.refresh = "hide";
        this.setState(this.state);
        this.onPfamButtonClick();
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

    onFilterChange(e) {

        this.state.pfamList = pfamList.filter(function (value) {
            return value.pfamA_Acc.includes(e.target.value);
        });
        this.setState(this.state);
    }

    handleOpen() {
        this.state.open = true;
        this.setState(this.state);
    };

    handleClose() {
        this.state.open = false;
        this.setState(this.state);
    };

    handleSubmit () {
        this.state.open = false;
        this.updateText(this.state.valueSelected);
        this.onStateReady();
    }

    handleRadioButtonChange(event, value) {
        this.state.valueSelected = value;
        this.setState(this.state);
    }

    render() {

        const actions = [
            <FlatButton
                label="Cancel"
                primary={true}
                onTouchTap={this.handleClose}
            />,
            <FlatButton
                label="Submit"
                primary={true}
                keyboardFocused={true}
                onTouchTap={this.handleSubmit}
            />,
        ];

        const radios = [];
        for (let i = 0; i < this.state.retrievedPfams.length; i++) {
            radios.push(
                <RadioButton
                    key={i}
                    value={`${this.state.retrievedPfams[i]}`}
                    label={`${this.state.retrievedPfams[i]}`}
                    style={styles.radioButton}
                />
            );
        }

        return (
            <MuiThemeProvider muiTheme={muiTheme}>
                <div style={styles.container}>
                    <h1>Contact Maps</h1>
                    <br />
                    <br />
                    <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'center'}}>
                        <div style={{marginRight: 50}}>
                            <div>
                                <TextField hintText="PFAM ID" value={this.state.pfam} onChange={this.onTextChange}
                                           onEnterKeyDown={this.onPfamButtonClick}/>
                                <FlatButton secondary={true} label="Open Map" onClick={this.onPfamButtonClick}/>
                            </div>
                            <div>OR</div>
                            <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'center'}}>
                                <div style={{marginRight: 10}}>
                                    <SelectField
                                        value={this.state.value}
                                        onChange={this.handleAccessionChange}
                                        style={styles.customWidth}>
                                        <MenuItem value={1} primaryText="PDB ID"/>
                                        <MenuItem value={2} primaryText="UniProt Accession"/>
                                        <MenuItem value={3} primaryText="UniProt Identifier"/>
                                        <MenuItem value={4} primaryText="InterPro Accession"/>
                                    </SelectField>
                                </div>
                                <div>
                                    <TextField hintText={this.state.hintText} value={this.state.pdb}
                                               onChange={this.onPdbChange} onEnterKeyDown={this.onPdbButtonClick}/>
                                    <FlatButton secondary={true} label="Open Map" onClick={this.onPdbButtonClick}/>
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
                                <img src={this.state.url} width="680"
                                     style={{display: (this.state.url == '' || this.state.imageHidden) ? 'none' : ''}}/>
                                <h2 style={{display: !this.state.imageHidden ? 'none' : ''}}>Contact map not found.</h2>
                            </div>
                        </div>
                        <div style={{textAlign: 'initial'}}>
                            <input
                                onChange={this.onFilterChange}
                                placeholder="Filter by Accession"
                            />
                            <br />
                            <Table
                                rowHeight={31}
                                rowsCount={this.state.pfamList.length}
                                width={680}
                                height={647}
                                headerHeight={31}>
                                <Column
                                    header={<Cell>Accession</Cell>}
                                    cell={({rowIndex, ...props}) => (
                                        <Cell {...props}>
                                            <a href={this.state.pfamList[rowIndex].pfamA_Acc}>{this.state.pfamList[rowIndex].pfamA_Acc}</a>
                                        </Cell>
                                    )}
                                    width={80}
                                />
                                <Column
                                    header={<Cell>Id</Cell>}
                                    cell={({rowIndex, ...props}) => (
                                        <Cell {...props}>
                                            {this.state.pfamList[rowIndex].pfamA_id}
                                        </Cell>
                                    )}
                                    width={120}
                                />
                                <Column
                                    header={<Cell>Description</Cell>}
                                    cell={({rowIndex, ...props}) => (
                                        <Cell {...props}>
                                            {this.state.pfamList[rowIndex].description}
                                        </Cell>
                                    )}
                                    width={480}
                                />
                            </Table>
                        </div>
                    </div>
                    <Dialog
                        title="Select PFAM"
                        actions={actions}
                        modal={false}
                        open={this.state.open}
                        onRequestClose={this.handleClose}
                        autoScrollBodyContent={true}
                    >
                        <RadioButtonGroup name="retrievedPfamsButtons" valueSelected={this.state.valueSelected}
                        defaultSelected={this.state.retrievedPfams[0]} onChange={this.handleRadioButtonChange}>
                            {radios}
                        </RadioButtonGroup>
                    </Dialog>
                </div>
            </MuiThemeProvider>
        );
    }
}

export default Main;

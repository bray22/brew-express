import React, { Component, useEffect } from 'react';
import Select from 'react-select';

class AutocompleteDropdown extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedOption: null,
      inputText: null,
      dropdownOptions: []
    };
  }

  componentDidMount() {
    console.log(this.props);
  }

  handleChange = (selectedOption) => {
    if (selectedOption) {
    this.props.updateBrewer(selectedOption.value);
    this.setState({ selectedOption });
    }

    else {this.setState({ selectedOption: null });}
  };

  handleInputChange = (inputText) => {
    if (inputText) {
      this.props.findBrewerByName(inputText)
      this.setState({ dropdownOptions: this.props.options });
    }
    
  };

  render() {
    const { selectedOption } = this.state;
    const { brewer } = this.props;

    // Replace this with your data source (e.g., an array of options)
    const options = this.state?.dropdownOptions ? this.state?.dropdownOptions?.map((item)=>{
      const option = { 
        label: "",
        value: "", 
      }
      option.label = item?.Name;
      option.value = item._id;
      return option
    }) : null;

    return (
      <div>
        <Select
          value={selectedOption || this.props.default}
          onChange={this.handleChange}
          onInputChange={this.handleInputChange}
          options={options}
          isClearable={true} // You can clear the selection
          placeholder="Select an option or start typing..."
          isSearchable={true} // Enable the search box for autocompletion
        />
      </div>
    );
  }
}

export default AutocompleteDropdown;

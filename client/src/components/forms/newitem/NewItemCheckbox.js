import React, {Component} from 'react';

export class NewItemCheckbox extends Component {

  handleonChange(event,option){
    const newValue = [...this.props.input.value]

    if(event.target.checked) {
      newValue.push(option.categoryName);
    } else {
      newValue.splice(newValue.indexOf(option.categoryName), 1);
    }

    return this.props.input.onChange(newValue);
  }

  renderCheckboxes = () => {
    return (
      <div className="container-fluid">
        <div className="row">
          {this.props.options.map((option,index) => (
            <label className="col s12 m6 l4 xl3" key={`${option.categoryName}`}>
              <input type="checkbox" 
                    className="filled-in" 
                    checked={this.props.input.value.indexOf(option.categoryName) !== -1}
                    name={`${option.categoryName}[${index}]`}
                    
                    value={option.categoryName}
                    onChange={(event) => this.handleonChange(event,option)}
                     />
              <span>{option.categoryName}</span>
            </label>
          ))}
        </div>
      </div>
    )
  }

  render() {
    return (
      <div>
        {this.renderCheckboxes()}
      </div>
    )
  }
}

export default NewItemCheckbox

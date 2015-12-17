var React = require('react');
var DatePicker = require('react-date-picker');
var moment = require('moment');

var TemZet = React.createClass({
	render: function() {
		return (
			<div className="Temzet">
				<h1>Temzet</h1>
				<TemzetForm />
			</div>
		);
	}
});

var TemzetForm = React.createClass({
    getInitialState: function() {
      return {
        startDate: moment(),
        endDate: moment()
      }
    },
    
    handleStartDateChange: function(date) {
      this.setState({
        startDate: date
      });
    },
    
    handleEndDateChange: function(date) {
      this.setState({
        endDate: date
      });
    },
  
	render: function() {
		return (
			<form className="TemzetForm">
				<div className="name">
					<label>Name</label>
					<input type="text" placeholder="Your name" />
				</div>
				<div className="month">
					<label>Month</label>
					<DatePicker date={this.props.startDate} />
				</div>
			</form>
		);
	}
});

var MonthDropdown = React.createClass({
    getInitialState: function() {
      return { data : [] }
    },
    
    render: function() {
        var monthNodes = this.props.data.map(function(month){
			return (
				<option value={month.id} >
					{month.text}
				</option>
			)
		});
        
        return (
            <select>{monthNodes}</select>
        );
    }
});

module.exports = TemZet;
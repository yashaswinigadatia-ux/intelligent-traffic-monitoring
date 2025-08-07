import React from "react";
import {
  Input,
  Button,
  Table,
  Divider,
  Header,
  Icon,
  Label,
} from "semantic-ui-react";
import userData from "./user_db.json"; // Import JSON data

export default class Fine extends React.Component {
  constructor(props) {
    super(props);
    const localData =
      JSON.parse(localStorage.getItem("users_data")) || userData;
    if (!localStorage.getItem("users_data")) {
      localStorage.setItem("users_data", JSON.stringify(userData));
    }

    this.state = {
      name: "-",
      phone: "-",
      address: "-",
      model: "-",
      fineSent: false,
      isMissing: "",
      vehicleNumberset: "",
      vehicleNumber: "",
      isverified: false,
      localStorageData: localData,
    };
  }

  showDetails = () => {
    const vehicle_number = this.state.vehicleNumberset.trim().toUpperCase();
    const regex = /^[A-Z]{2}[0-9]{2}[A-Z]{2}[0-9]{4}$/;

    if (!regex.test(vehicle_number)) {
      alert("Invalid vehicle number, please enter in format AA11AA1111");
      return;
    }

    const { localStorageData } = this.state;
    const registered_car_numbers = localStorageData.map(
      (x) => x.vehicleNumber
    );

    if (!registered_car_numbers.includes(vehicle_number)) {
      alert("Vehicle not found in our database");
      return;
    }

    const resultData = localStorageData.find(
      (x) => x.vehicleNumber === vehicle_number
    );

    this.setState({
      ...resultData,
      isverified: true,
      vehicleNumber: vehicle_number,
      fineSent: false,
    });
  };

  sendFine = () => {
    this.setState({
      fineSent: true,
    });
  };

  handleInput = (event) => {
    this.setState({ vehicleNumberset: event.target.value });
  };

  render() {
    return (
      <div style={styles.center}>
        <div style={styles.form} className="fine">
          <Header as="h3">
            <Icon name="search" />
            <Header.Content>
              Find License Plate
              <Header.Subheader>Find the owner of the vehicle</Header.Subheader>
            </Header.Content>
          </Header>

          <Input
            placeholder="Enter Plate Number - AA11AA1111"
            onChange={this.handleInput}
            value={this.state.vehicleNumberset}
          />
          <br />
          <Button primary onClick={this.showDetails}>
            FIND VEHICLE
          </Button>
          <br />
          <br />
          <Divider section />

          {this.state.isverified && (
            <div className="challan">
              <Header as="h3">
                <Icon name="money" />
                <Header.Content>
                  Send Fine
                  <Header.Subheader>
                    Send fine to owner's phone
                  </Header.Subheader>
                </Header.Content>
              </Header>

              <Input labelPosition="right" type="text" placeholder="Fine Amount">
                <Label basic>&#8377;</Label>
                <input />
                <Label>.00</Label>
              </Input>
              <br />
              {this.state.fineSent ? (
                <Button color="green">
                  <Icon name="check" /> FINE SENT
                </Button>
              ) : (
                <Button color="blue" onClick={this.sendFine}>
                  SEND FINE
                </Button>
              )}
            </div>
          )}
        </div>

        <div className="rc-info">
          {!this.state.isverified ? (
            <img
              className="car-placeholder"
              src="https://image.freepik.com/free-icon/car-black-side-silhouette_318-43519.jpg"
              alt="Placeholder"
            />
          ) : (
            <img
              src="https://www.motorbeam.com/wp-content/uploads/Hyundai-Verna-Brown.jpg"
              alt="Car"
            />
          )}

          <Table singleLine>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell colSpan="2">
                  REGISTRATION CERTIFICATE INFO
                </Table.HeaderCell>
              </Table.Row>
            </Table.Header>

            <Table.Body>
              <Table.Row>
                <Table.Cell>Registration Number</Table.Cell>
                <Table.Cell>{this.state.vehicleNumber}</Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell>Owner's Name</Table.Cell>
                <Table.Cell>
                  <b>{this.state.name}</b>
                </Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell>Owner's Phone</Table.Cell>
                <Table.Cell>{this.state.phone}</Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell>Address</Table.Cell>
                <Table.Cell>{this.state.address}</Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell>Is Missing</Table.Cell>
                <Table.Cell>{this.state.isMissing}</Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell>Model</Table.Cell>
                <Table.Cell>{this.state.model}</Table.Cell>
              </Table.Row>
            </Table.Body>
          </Table>
        </div>
      </div>
    );
  }
}

const styles = {
  center: {
    display: "flex",
    justifyContent: "center",
    height: "100%",
    padding: 20,
  },
  form: {
    display: "flex",
    flexDirection: "column",
    padding: 20,
  },
};

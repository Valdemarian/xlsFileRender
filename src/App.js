import React, { Component } from 'react';
import Dropzone from 'react-dropzone'
import { Table } from 'antd';
import XLSX from 'xlsx';
import logo from './logo.svg';

import './App.css';
import 'antd/dist/antd.css';
class App extends Component {

  state = { 
    data: null,
    columns: null
  }

  handleFile(e) {
    const form = document.querySelector('#form');
    const file = form.querySelector('#file');
    const fileValue = file.files;

    const formData = new FormData(document.getElementById("form"));
    formData.append('file', fileValue);

    const reader = new FileReader();

    const fileToRead = document.querySelector('#file').files[0];

    reader.onload = function(e) {
      let data = new Uint8Array(e.target.result);
      let workbook = XLSX.read(data, {type: 'array'});

      let first_worksheet = workbook.Sheets[workbook.SheetNames[0]];
      data = XLSX.utils.sheet_to_json(first_worksheet);

      const dataRender = data.map((item, idx) => ({ ...item, key: idx }));

      let ColumnsFinal = Object.keys(dataRender[0])
      ColumnsFinal.pop()

      let columns = ColumnsFinal.map((a, i, ColumnsFinal) => {
        return { 
          title: ColumnsFinal[i],
          dataIndex: ColumnsFinal[i],
          key: i
        }
      })

      this.setState({ 
        data: dataRender,
        columns: columns
      })
    }.bind(this);

    reader.readAsArrayBuffer(fileToRead);
  }
  
  render(){
    const { data, columns } = this.state

    return (
      <div className="App">
        <header className="App-header">

        <form id="form">
          <Dropzone onDrop={acceptedFiles => this.handleFile(acceptedFiles)}>
            {({getRootProps, getInputProps}) => (
                <div {...getRootProps()}>
                  <input type="file" id="file" {...getInputProps()} />
                  <p>Нажмите на Атом для загрузки xlsx файла</p>
                  <img src={logo} className="App-logo" alt="logo" />
                </div>
            )}
          </Dropzone>
        </form> 

        <Table dataSource={data} columns={columns} />

        </header>
      </div>
    );
  }
}

export default App;

import React, {useEffect, useState} from 'react';
import axios from 'axios';
import Comida from './Comida';
import Colaborador from './Colaborador'
import ButtonAppBar from './AppBar';
import "./style.css"


function TelaCadastro() {
    
    

    return (
        <div>
            <div class="app-bar">
                <ButtonAppBar />
            </div>

            <div class="container">
                <br/><br/><br/>
                
                <br/><br/><br/>
                    <div class="telas">
                        <div class="row">

                            <div class="col-4">
                                <Colaborador />
                            </div>
                            
                            <div class="col-8">
                                <Comida />
                            </div>
                    </div>

                </div>
            
            </div>
        </div>
        
      );
    }
    
    export default TelaCadastro;
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import InputMask from 'react-input-mask';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

function Colaborador() {
  const [colaborador, setColaborador] = useState({
    cpf: '',
    name: ''
  });

  const [colaboradores, setColaboradores] = useState([]);
  const [atualizar, setAtualizar] = useState([]);
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    if (atualizar) {
      axios.get("https://sistema-cafe-da-manha-back-spring.onrender.com/collaborators")
        .then(result => {
          setColaboradores(result.data);
        });
    }
  }, [atualizar]);

  function handleChange(event) {
    setColaborador({ ...colaborador, [event.target.name]: event.target.value });
  }

  function handleSubmit(event) {
    event.preventDefault();
    axios.post("https://sistema-cafe-da-manha-back-spring.onrender.com/collaborators", colaborador)
      .then(result => {
        setAtualizar(!atualizar);
        setOpenModal(false);
      });
  }

  function excluir(cpf) {
    axios.delete("https://sistema-cafe-da-manha-back-spring.onrender.com/collaborators/" + cpf)
      .then(result => {
        setAtualizar(!atualizar);
      });
  }

  return (
    <div className='container'>
      <div className="d-flex justify-content-between align-items-center">
        <h2>Participantes</h2>
        <button onClick={() => setOpenModal(true)} className='btn btn-secondary'>+</button>
      </div>
      <br />

      <table className="table table-bordered">
        <thead className="table-dark">
          <tr>
            <th scope="col">Nome</th>
            <th scope="col">CPF</th>
            <th scope="col">Operações</th>
          </tr>
        </thead>
        <tbody>
          {colaboradores.map(col => (
            <tr key={col.id}>
              <td>{col.name}</td>
              <td>
                <InputMask
                  mask="999.999.999-99"
                  maskChar={null}
                  value={col.cpf}
                  readOnly
                  style={{ border: 'none', width: 130 }}
                />
              </td>
              <td>
                <button onClick={() => excluir(col.cpf)} className='btn btn-light'>
                  <FontAwesomeIcon icon={faTrash} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {openModal && (
        <form onSubmit={handleSubmit}>
          <div className='col-6'>
            <div>
              <br />
              <h5>Novo Colaborador</h5>
              <InputMask
                mask="99999999999"
                maskChar={null}
                onChange={handleChange}
                value={colaborador.cpf}
                name='cpf'
                type='text'
                className='form-control'
                placeholder='Insira o CPF'
              />
            </div>

            <div>
              <input onChange={handleChange} value={colaborador.name} name='name' type='text' className='form-control' placeholder='Insira o nome'></input>
            </div>
            <br />
            <input className='btn btn-success' type='submit' value="Confirmar"></input>
          </div>
        </form>
      )}
    </div>
  );
}

export default Colaborador;
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import InputMask from 'react-input-mask';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Comida() {
  const [comida, setComida] = useState({
    id: '',
    name: '',
    collaboratorCPF: '',
    date: '',
    brought: ''
  });

  const [comidas, setComidas] = useState([]);
  const [atualizar, setAtualizar] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [dataFiltro, setDataFiltro] = useState('');
  const [editando, setEditando] = useState(false);

  useEffect(() => {
    axios.get("https://sistema-cafe-da-manha-back-spring.onrender.com/foods")
      .then(result => { setComidas(result.data) });
  }, [atualizar]);

  useEffect(() => {
    if (dataFiltro) {
      axios.get(`https://sistema-cafe-da-manha-back-spring.onrender.com/foods/date/${dataFiltro}`)
        .then(result => {
          const comidasFiltradas = result.data;
          const comidasOrdenadas = comidasFiltradas.sort((a, b) => a.id - b.id);
          setComidas(comidasOrdenadas);
        })
        .catch(error => {
          console.error("Erro ao filtrar comidas por data:", error);
          setComidas([]);
        });
    } else {
      axios.get("https://sistema-cafe-da-manha-back-spring.onrender.com/foods")
        .then(result => { setComidas(result.data) });
    }
  }, [atualizar, dataFiltro]);

  function handleChange(event) {
    setComida({ ...comida, [event.target.name]: event.target.value });
  }

  function handleSubmit(event) {
    event.preventDefault();

    if (editando) {
      axios.put(`https://sistema-cafe-da-manha-back-spring.onrender.com/foods/${comida.id}`, comida)
        .then(result => {
          setAtualizar(result);
          toast.success("Comida editada com sucesso!");
        })
        .catch(error => {
          console.error("Erro ao editar comida:", error);
          toast.error("Erro ao editar comida. Por favor, tente novamente.");
        });
    } else {
      axios.post("https://sistema-cafe-da-manha-back-spring.onrender.com/foods", comida)
        .then(result => {
          setAtualizar(result);
          toast.success("Comida adicionada com sucesso!");
        })
        .catch(error => {
          console.error("Erro ao adicionar comida:", error);
          toast.error("Erro ao adicionar comida. Por favor, tente novamente.");
        });
    }

    setOpenModal(false);
    setEditando(false);
  }

  function excluir(id) {
    axios.delete(`https://sistema-cafe-da-manha-back-spring.onrender.com/foods/${id}`)
      .then(result => {
        setAtualizar(result);
        toast.success("Comida excluída com sucesso!");
      })
      .catch(error => {
        console.error("Erro ao excluir comida:", error);
        toast.error("Erro ao excluir comida. Por favor, tente novamente.");
      });
  }

  function editarComida(com) {
    setComida(com);
    setEditando(true);
    setOpenModal(true);
  }

  return (
    <div className='container'>
      <div className="d-flex justify-content-between align-items-center">
        <h2>Comidas</h2>
        <div className="d-flex">
          <input
            type="date"
            value={dataFiltro}
            onChange={(e) => setDataFiltro(e.target.value)}
            className="form-control me-2"
          />
          <button onClick={() => setDataFiltro(dataFiltro)} className='btn btn-secondary'>
            Filtrar
          </button>
          <button onClick={() => setOpenModal(true)} className='btn btn-secondary ms-2'>+</button>
        </div>
      </div>
      <br />

      {comidas.length > 0 ? (
        <table className="table table-bordered">
          <thead className="table-dark">
            <tr>
              <th scope="col">#</th>
              <th scope="col">Nome</th>
              <th scope="col">CPF</th>
              <th scope="col">Data</th>
              <th scope="col">Trouxe a Comida</th>
              <th scope="col">Operações</th>
            </tr>
          </thead>
          <tbody>
            {comidas.map(com => (
              <tr key={com.id}>
                <td>{com.id}</td>
                <td>{com.name}</td>
                <td>
                <InputMask
                  mask="999.999.999-99"
                  maskChar={null}
                  value={com.collaboratorCPF}
                  readOnly
                  style={{ border: 'none', width: 130 }}
                />
              </td>
                <td>{com.date}</td>
                <td>{com.brought ? 'Sim' : 'Não'}</td>
                <td>
                  <button onClick={() => editarComida(com)} className='btn btn-light'>
                    <FontAwesomeIcon icon={faEdit} />
                  </button>
                  &nbsp;&nbsp;
                  <button onClick={() => excluir(com.id)} className='btn btn-light'>
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>Nenhuma comida encontrada.</p>
      )}

      {openModal && (
        <form onSubmit={handleSubmit}>
          <div className='col-6'>
            <br/>
            <h5>{editando ? 'Editar Comida' : 'Nova Comida'}</h5>
            <div>
              <input placeholder='Insira o nome' onChange={handleChange} value={comida.name} name='name' type='text' className='form-control'></input>
            </div>

            <InputMask
              mask="99999999999"
              maskChar={null}
              onChange={handleChange}
              value={comida.collaboratorCPF}
              name='collaboratorCPF'
              type='text'
              className='form-control'
              placeholder='Insira o CPF'
            />

            <div>
              <input
                type="date"
                value={comida.date}
                onChange={(e) => setComida({ ...comida, date: new Date(e.target.value).toISOString().split('T')[0] })}
                className="form-control me-2"
              />
            </div>

            <div>
              <label htmlFor="brought">Trouxe a comida:</label>
              <select
                id="brought"
                name="brought"
                value={comida.brought}
                onChange={handleChange}
                className="form-control"
              >
                <option value="true">Sim</option>
                <option value="false">Não</option>
              </select>
            </div>

            <br />
            <input className='btn btn-success' type='submit' value={editando ? 'Editar' : 'Adicionar'}></input>
          </div>
        </form>
      )}

      <ToastContainer />
    </div>
  );
}

export default Comida;

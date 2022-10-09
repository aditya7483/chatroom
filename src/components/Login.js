import { Backdrop, CircularProgress } from '@mui/material';
import React, { useState } from 'react'
import './Login.css'

export const Login = () => {

  const [fields, setFields] = useState({
    email: '',
    username: '',
    password: '',
  });
  const [errors, setErrors] = useState('');
  const [signup, setSignup] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleTextChange = (e) => {
    setFields({
      ...fields,
      [e.target.name]: e.target.value
    })
  }

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true)
    // let res = await fetch('https://notes74.herokuapp.com/api/auth/signup', {
    let res = await fetch('http://localhost:3001/api/auth/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: fields.username,
        email: fields.email,
        password: fields.password
      })
    })
    let data = await res.json();

    if (data.err) {
      handleChange()
      setErrors(data.err)
      setLoading(false)
    }
    else {
      getAuth()
    }
  }

  const handleChange = () => {
    setFields(
      {
        username: '',
        password: '',
        email: ''
      }
    )
  }

  const getAuth = async () => {
    // let res = await fetch('https://notes74.herokuapp.com/api/auth/login', {
    try {
      let res = await fetch('http://localhost:3001/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username: fields.username,
          password: fields.password
        })
      })
      let data = await res.json();

      if (data.err) {
        handleChange()
        setErrors(data.err)
        setLoading(false)
      }
      else {
        // console.log(data)
        handleChange()
        localStorage.setItem('auth-token', data.authToken)
        window.location.reload()
      }
    }
    catch (err) {
      setLoading(false)
    }
  }

  const handleLogin = async (e) => {
    e.preventDefault();
    if (signup) {
      if (isValidEmail(fields.email)) {
        setLoading(true);
        getAuth()
      }
      else {
        setLoading(false)
        setErrors('Please Enter a valid email')
      }
    }
    else {
      setLoading(true)
      getAuth()
    }
  }

  const isValidEmail = (email) => {
    var validRegex = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
    if (!email.match(validRegex)) {
      return false
    }
    else return true
  }

  return (
    <div className="my-container">
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <div >
        <div >
          <div >
            <div>
              <h3 className='text-center my-4'>
                Login
              </h3>
            </div>
            <form>

              <div>
                {errors.length !== 0 && <div className="alert alert-danger" role="alert">
                  {errors}
                </div>
                }
                {
                  signup &&
                  <div className="mb-3">
                    <label htmlFor="loginEmail" className="form-label">Email</label>
                    <input name='email' type="email" className="form-control" id="loginEmail" placeholder="Enter Your Email" value={fields.email} required minLength={'4'} onChange={handleTextChange} />
                  </div>
                }
                <div className="mb-3">
                  <label htmlFor="loginUsername" className="form-label">Username</label>
                  <input name='username' type="text" className="form-control" id="loginUsername" placeholder="Enter Your Username" value={fields.username} required minLength={'4'} onChange={handleTextChange} />
                </div>
                <div className="mb-3">
                  <label htmlFor="loginPass" className="form-label">Password</label>
                  <input name='password' type="password" className="form-control" id="loginPass" placeholder="Enter Your Password" value={fields.password} required minLength={'5'} onChange={handleTextChange} />
                </div>

              </div>
              <div className="modal-footer justify-content-center flex-column">
                {
                  !signup ? <div className="d-grid gap-2 col-6 mx-auto">
                    <button type="submit" className="btn btn-primary" onClick={handleLogin}>Login</button>
                  </div>
                    :
                    <div className="d-grid gap-2 col-6 mx-auto">
                      <button type="submit" className="btn btn-primary" onClick={handleSignup}>Signup</button>
                    </div>
                }
                <p className='text-center mt-3'>

                  {
                    !signup ?
                      <>
                        Dont have an account? <button className='border-0 text-primary' onClick={() => {
                          setSignup(true)
                          handleChange();
                        }}>Signup</button>
                      </> :
                      <>
                        Already have an account? <button className='border-0 text-primary' onClick={() => {
                          setSignup(false)
                          handleChange();
                        }}>Login</button>
                      </>
                  }

                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

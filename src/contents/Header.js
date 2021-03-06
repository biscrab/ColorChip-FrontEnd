import React,{useEffect, useState, useRef} from "react";
import * as S from '../styled/App'
import { useHistory } from "react-router";
import axios from "axios";
import { useCookies } from 'react-cookie';
import logo from '../images/color.png'

const Header = () => {

    let history = useHistory();

    const [user, setUser] = useState();
    const [onlogin, setOnlogin] = useState(false);
    const [input, setInput] = useState({name: "", password: ""})
    const [cookies, setCookie, removeCookie] = useCookies(['c-token']);
    const name = useRef();
    const password = useRef();

    function getCookie(cName) {
        cName = cName + '=';
        var cookieData = document.cookie;
        var start = cookieData.indexOf(cName);
        var cValue = '';
        if(start !== -1){
        start += cName.length;
        var end = cookieData.indexOf(';', start);
        if(end === -1)end = cookieData.length;
        cValue = cookieData.substring(start, end);
        }
        return unescape(cValue);
    }

    useEffect(()=>{
        console.log(cookies);
        if(getCookie('c-token')){
            axios.get('http://color-chip.herokuapp.com/user')
                .then(res => setUser(res.data))
        }
    },[cookies, ])

    const login = () => {
        axios.post('http://color-chip.herokuapp.com/login', input)
            .then(res => {
                setOnlogin(false)
                setCookie('c-token', res.data)
            })
        window.location.reload();
    }

    const signup = () => {
        axios.post('http://color-chip.herokuapp.com/signup', input)
            .then(res => setOnlogin(false))
    }

    const logout = () => {
        removeCookie('c-token')
        window.location.reload();
    }

    const onChange = (e) => {
        const {name, value} = e.target;
        setInput({
            ...input,
            [name]: value
        })
    }

    const LoginBorder = () => {
        return(
          <S.Background>
            <S.LoginBorder className="border">
                <S.LoginHeader>
                    <h3>?????????/????????????</h3>
                    <span onClick={()=>setOnlogin(false)}>x</span>
                </S.LoginHeader>
                <S.LDiv>
                    <input ref={name} placeholder="??????" name="name" onChange={(e)=>onChange(e)} value={input.name}/>
                    <input ref={password} type="password" placeholder="????????????" name="password" onChange={(e)=>onChange(e)} value={input.password}/>
                    <div>
                        <button onClick={()=>login()}>?????????</button>
                        <button onClick={()=>signup()}>????????????</button>
                    </div>
                </S.LDiv>
            </S.LoginBorder>
          </S.Background>
        )
      }

    return(
        <>
        <S.Header>
            <S.Head onClick={()=>history.push('/')}>
                <div>
                    <img src={logo} alt="logo"></img>
                    <h2>?????? ???</h2>
                </div>
                {user ?
                    <div>
                        <span className="name">{user} ???</span>
                        <span onClick={()=>logout()}>????????????</span>
                    </div>
                    :
                    <span onClick={()=>setOnlogin(true)}>?????????/????????????</span>
                }
            </S.Head>
        </S.Header>
        {onlogin ?
            <LoginBorder />
            :
            <></>
        }
        </>
    )
}

export default Header;
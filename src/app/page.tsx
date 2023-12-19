'use client';
import { AppwriteService, account, functions } from '@/appwrite/config';
import { ID } from 'appwrite';
import { useState, useEffect } from 'react';
import { MercadoPagoConfig, CardToken } from 'mercadopago';
import { CardPayment, Wallet, initMercadoPago } from '@mercadopago/sdk-react';

const LoginPage = () => {
  initMercadoPago('TEST-1b18186d-f77b-4214-a7b5-67ca434458c6');
  const [loggedInUser, setLoggedInUser] = useState<any>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [data, setData] = useState<any>(null);

  const appwrite = new AppwriteService();

  const mpFunction = async () => {
    const data = await functions.createExecution(
      'mercado-pago-function',
      JSON.stringify({
        items: [
          {
            title: 'producto de prueba',
            currency: 'ARS',
            picture_url: 'http://',
            description: 'descripcion del producto',
            category_id: '',
            quantity: 2,
            price: 50,
          },
        ],
        links: {
          success_url: 'http://',
          failure_url: 'http://',
          pending_url: 'http://',
          notification_url: 'http://',
        },
      }),
      false,
      '/',
      'POST'
    );
    return data;
  };

  const paypalFunction = async () => {
    const data = await functions.createExecution(
      'paypal-function',
      JSON.stringify({
        items: [
          {
            title: 'producto de prueba',
            description: 'descripcion del producto',
            currency: 'USD',
            price: '50',
            quantity: '2',
          },
        ],
        total: '100',
        brand_name: 'weperbel',
        links: {
          success_url: 'http://localhost:3000',
          failure_url: 'http://localhost:3001',
        },
      }),
      false,
      '/',
      'POST'
    );
    return data;
  };

  const stripeFunction = async () => {
    const data = await functions.createExecution(
      'stripe-function',
      JSON.stringify({
        items: [
          {
            currency: 'usd',
            title: 'producto de prueba',
            description: 'descripcion del producto',
            price: '50',
            quantity: '2',
            picture_url: 'http://localhost:3002',
          },
        ],
        links: {
          success_url: 'http://localhost:3000',
          failure_url: 'http://localhost:3001',
        },
      }),
      false,
      '/',
      'POST'
    );
    return data;
  };

  const transbankFunction = async () => {
    const data = await functions.createExecution(
      'transbank-function',
      JSON.stringify({
        order_id: 'test-order-01',
        session_id: 'test-session-01',
        price: 150,
        return_url: 'https://',
      }),
      false,
      '/',
      'POST'
    );
    return data;
  };

  const ualabisFunction = async () => {
    const data = await functions.createExecution(
      'uala-bis-function',
      JSON.stringify({
        description: 'descripcion del producto',
        price: '5',
        links: {
          success_url: 'https://localhost:3000.com',
          failure_url: 'https://localhost:3001.com',
          notification_url: 'https://localhost:3002.com',
        },
      }),
      false,
      '/',
      'POST'
    );
    return data;
  };

  useEffect(() => {
    // ualabisFunction().then((val) => console.log(JSON.parse(val.responseBody)));
    // setData(mp);
    // console.log('data: ', data);
  }, []);

  const login = async (email: string, password: string) => {
    await appwrite.loginUserAccount({ email, password });
    setLoggedInUser(await appwrite.isLoggedIn());
  };

  const register = async () => {
    await appwrite.createUserAccount({ email, password, name });
    login(email, password);
  };

  const logout = async () => {
    await appwrite.logoutUserAccount();
    setLoggedInUser(null);
  };

  if (loggedInUser) {
    const data = appwrite.users();
    console.log('usuarios :', data);
    // ualabisFunction().then((val) => console.log(JSON.parse(val.responseBody)));
    // setData(mp);
    // console.log('data: ', data);
    return (
      <div>
        <p>Logged in as {loggedInUser.name}</p>
        <button type="button" onClick={logout}>
          Logout
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-end content-end justify-end">
        {/* <form
          method="post"
          action="https://webpay3gint.transbank.cl/webpayserver/initTransaction"
        >
          <input
            type="hidden"
            name="token_ws"
            value="01ab2cff95e21062800688705dedc7537169e8f7894065eb88f895ad07eb6a8e"
          />
          <input type="submit" value="Ir a pagar" />
        </form> */}
      </div>
      <div className="items-center">
        <p className="text-center">Not logged in</p>
        <form className="flex flex-col m-auto w-1/2 gap-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="text-black"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="text-black"
          />
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="text-black"
          />
          <button type="button" onClick={() => login(email, password)}>
            Login
          </button>
          <button type="button" onClick={register}>
            Register
          </button>
        </form>
      </div>
      {/* <CardPayment
        initialization={initialization}
        onSubmit={onSubmit}
        onReady={onReady}
        onError={onError}
      /> */}
    </div>
  );
};

export default LoginPage;

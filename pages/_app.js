import { UserProvider } from "../components/User";
import { ContractProvider } from "../components/Contract";
import { NotificationProvider } from "../components/Notification";
import "../styles/globals.css";
import Layout from "../components/Layout/";

function App({ Component, pageProps }) {
  return (
    <NotificationProvider>
      <UserProvider>
        <ContractProvider>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </ContractProvider>
      </UserProvider>
    </NotificationProvider>
  );
}

export default App;

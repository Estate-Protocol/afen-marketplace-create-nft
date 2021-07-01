import { UserProvider } from "../components/User";
import { ContractProvider } from "../components/Contract";
import { NotificationProvider } from "../components/Notification";
import { AuthProvider } from "../components/Auth";
import "../styles/globals.css";
import Layout from "../components/Layout/";

export function getInitialProps(ctx) {}

function App({ Component, pageProps }) {
  return (
    <NotificationProvider>
      <AuthProvider>
        <UserProvider>
          <ContractProvider>
            <Layout>
              <Component {...pageProps} />
            </Layout>
          </ContractProvider>
        </UserProvider>
      </AuthProvider>
    </NotificationProvider>
  );
}

export default App;

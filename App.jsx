import { Suspense, lazy } from "react";
import {
  Route,
  BrowserRouter as Router,
  Routes,
  useLocation,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Static Components
import Footer from "./components/footer/Footer";
import Header from "./components/header/Header";
import PrivateRoute from "./components/privateRoute/PrivateRoute";
import ScrollTop from "./components/scrollTop/ScrollTop";
import AddBookForm from "./pages/admin/adminBody/addBook/AddBookForm";
import AllCustomers from "./pages/admin/adminBody/allCustomers/AllCustomers";
import BookList from "./pages/admin/adminBody/bookList/BookList";
import BookViewDetails from "./pages/admin/adminBody/bookList/bookViewDetails/BookViewDetails";
import Dashboard from "./pages/admin/adminBody/dashboard/Dashboard";
import IssueBookForm from "./pages/admin/adminBody/issueBookForm/IssueBookForm";
import IssueBookHistoryList from "./pages/admin/adminBody/issueBookForm/issueBookHistory/IssueBookHistorList";
import EditBook from "./pages/admin/editBook/EditBook";
import SideBarLayout from "./pages/admin/sideBarLayout/SideBarLayout";
import ProfileInformation from "./pages/profileInformation/ProfileInformation";
import UserDashboard from "./pages/userDashboard/UserDashboard";
const PublicBooks = lazy(() => import("./pages/books/PublicBooks"));

// Lazy-loaded Pages
const Home = lazy(() => import("./pages/home/Home"));
const Login = lazy(() => import("./pages/auth/login/Login"));
const Register = lazy(() => import("./pages/auth/register/Register"));
const PageNotFound = lazy(() => import("./pages/pageNotFound/PageNotFound"));

// Fallback Loader
const Loader = () => (
  <div className="min-h-screen flex items-center justify-center bg-white">
    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
  </div>
);

// Helper to conditionally render header/footer
const LayoutWrapper = ({ children }) => {
  const location = useLocation();

  const hideHeaderFooterRoutes = [
    "/admin-dashboard",
    "/admin-dashboard/dashboard",
    "/admin-dashboard/all-customers",
  ];

  const shouldHideHeaderFooter = hideHeaderFooterRoutes.some((path) =>
    location.pathname.startsWith(path)
  );

  return (
    <>
      {!shouldHideHeaderFooter && <Header />}
      {children}
      {!shouldHideHeaderFooter && <Footer />}
    </>
  );
};

function App() {
  return (
    <Router>
      <ScrollTop />
      <LayoutWrapper>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
        />

        <Suspense fallback={<Loader />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/signup" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/public-books" element={<PublicBooks />} />
            <Route
              path="/book-view-details/:id"
              element={<BookViewDetails />}
            />
            <Route path="/profile-info" element={<ProfileInformation />} />
            <Route path="*" element={<PageNotFound />} />

            <Route
              path="/user-dashboard"
              element={
                <PrivateRoute role="user">
                  <UserDashboard />
                </PrivateRoute>
              }
            />

            <Route
              path="/admin-dashboard/*"
              element={
                <PrivateRoute role="admin">
                  <SideBarLayout />
                </PrivateRoute>
              }
            >
              <Route index element={<Dashboard />} />
              <Route path="all-customers" element={<AllCustomers />} />
              <Route path="all-books" element={<BookList />} />

              <Route path="add-book-form" element={<AddBookForm />} />
              <Route path="edit-book-form/:id" element={<EditBook />} />
              <Route path="issue-book-form" element={<IssueBookForm />} />
              <Route
                path="issue-book-history"
                element={
                  <Suspense fallback={<Loader />}>
                    <IssueBookHistoryList />
                  </Suspense>
                }
              />
            </Route>
          </Routes>
        </Suspense>
      </LayoutWrapper>
    </Router>
  );
}

export default App;

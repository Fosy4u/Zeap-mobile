// import secureLocalStorage from "react-secure-storage";

// interface UserDataModel {
//     name: string;
//     token: string;
// }

// const AuthorizationHeader = () => {
//     //  Get Agent Token from the Session Storage.
//     const {token} = secureLocalStorage.getItem("payDayUserData") as UserDataModel;
//     // console.log("ACCESS TOKEN:::", token);

//     return (token) ? ({
//         "Accept": "application/json",
//         "Content-Type": "application/json",
//         "Authorization": token
//     }) : ({
//         "Accept": "application/json",
//         "Content-Type": "application/json",
//     });
// }

// export default AuthorizationHeader;
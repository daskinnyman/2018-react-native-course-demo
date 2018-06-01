import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
         container: {
           flex: 1,
           backgroundColor: 'white',
           justifyContent: 'center',
           alignItems: 'center'
         },
         userProfileWrapper: {
           marginTop: -150,
           justifyContent: 'center',
           alignItems: 'center'
         },
         avatar: {
           width: 150,
           height: 150,
           borderRadius: 4
         },
         username: {
           margin: 8
         },
         logoutButton: {
           width: 150,
           marginTop: 32
         }
       });

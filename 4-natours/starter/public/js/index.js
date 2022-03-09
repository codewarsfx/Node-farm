import {loginUser, logoutUser} from './login'
import {updateSetting, updateUserInfo} from './updateUser'



const domElements = {
    emailELement: document.querySelector('#email'),
    nameELement: document.querySelector('#name'),
    passwordElement: document.querySelector('#password'),
    formElement: document.querySelector('.l'),
    formUserELement:document.querySelector('.form-user-data'),
    logOut: document.querySelector('.logout'),
    currentPasswordElement: document.querySelector('#password-current'),
    newPasswordElement : document.querySelector('#password'),
    confirmPasswordELement: document.querySelector('#password-confirm'),
    passwordFormElement:document.querySelector('.password-form')
}


if(domElements.formElement){
  domElements.formElement.addEventListener('submit',(e)=>{
        e.preventDefault()
        emailValue = domElements.emailELement.value,
        passwordValue = domElements.passwordElement.value
        loginUser(emailValue,passwordValue)
    })
}

if(domElements.logOut){
    domElements.logOut.addEventListener('click',()=>{
        logoutUser()
        
    })
}


if(domElements.formUserELement){

    domElements.formUserELement.addEventListener('submit' ,e=>{
        e.preventDefault()
        
        const nameValue = domElements.nameELement.value
        
        const emailValue =domElements.emailELement.value
        
        updateSetting({nameValue,emailValue},'data')
    })

}
const btn = document.querySelector('.btn-save-pass')
if(btn){
    btn.addEventListener('click',()=>{
             btn.textContent = "Updating Password..."
        })
}
 
        
if(domElements.passwordFormElement){
    domElements.passwordFormElement.addEventListener('submit', async e=>{
        e.preventDefault()
       const currentPassword = domElements.currentPasswordElement.value
        const newPassword = domElements.newPasswordElement.value
        const confirmPassword = domElements.confirmPasswordELement.value
        
       await updateSetting({currentPassword,newPassword,confirmPassword},'password')
       
        btn.textContent ='Save password'
    })
    
}
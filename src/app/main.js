






function includeHTML(callback) {
    var z, i, elmnt, file, xhttp;
    /* Loop through a collection of all HTML elements: */
    z = document.getElementsByTagName("*");
    for (i = 0; i < z.length; i++) {
        elmnt = z[i];
        /* Search for elements with a certain attribute: */
        file = elmnt.getAttribute("include");
        if (file) {
            /* Make an HTTP request using the attribute value as the file name: */
            xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function () {
                if (this.readyState == 4) {
                    if (this.status == 200) {
                        elmnt.innerHTML = this.responseText;
                        /* Execute any <script> tags within the included HTML: */
                        var scripts = elmnt.getElementsByTagName("script");
                        for (var j = 0; j < scripts.length; j++) {
                            eval(scripts[j].innerText);
                        }
                    }
                    if (this.status == 404) { elmnt.innerHTML = "Page not found."; }
                    /* Remove the attribute, and call this function once more: */
                    elmnt.removeAttribute("include");
                    includeHTML(callback);
                }
            }
            xhttp.open("GET", file, true);
            xhttp.send();
            /* Exit the function: */
            return;
        }
    }
    /* Execute the callback function once all includes are completed: */
    if (typeof callback === "function") {
        callback();
    }
}


includeHTML(function () {
    const Notify = Quasar.Notify
    const $q = Quasar.useQuasar

    const app = Vue.createApp({
        data: () => ({
            uid: null,
            auth: 'home',
            notify: false,
            config: { message: 'testing', type: 'positive' },
            loginForm: {
                username: '',
                password: ''
            },
            cardView: true,
            dialog: false,
            loader: false,
            img: "https://landingfoliocom.imgix.net/store/collection/niftyui/images/team/8/member-2.png",
            fileInputImage: null,
            dform: {
                id: null,
                email: null,
                firstName: null,
                lastName: null,
                username: null,
                gender: null,
                age: null,
                password: null,
                img: null,
                matricNo: null,
                dob: null
            },
            database: {
                users: [

                ],
                user: null
            },
            loding: false
        }),
        computed: {
            activeUser() {
                let uid = localStorage.getItem('activeUser') || null
                let user = JSON.parse(localStorage.getItem('userData')) || {}
                this.uid = uid
                this.database.user = user
                return uid
            },
            isValid() {
                if (this.loginForm.username && this.loginForm.password) {
                    return true
                }

                return false
            },
            isValid2() {
                if (
                    this.dform.email &&
                    this.dform.firstName &&
                    this.dform.lastName &&
                    this.dform.username &&
                    this.dform.matricNo &&
                    this.dform.age &&
                    this.dform.dob &&
                    this.dform.password &&
                    this.dform.gender
                ) { return true }

                return false
            }
        },
        methods: {
            Print() {
                window.print()
            },
            CreateImageObj(e) {
                let file = e.target.files[0]
                this.img = URL.createObjectURL(file)
                this.UplaodImg(file)
            },
            base64Url(base64) {
                try {
                    const parts = base64.split(',');
                    if (parts.length !== 2) {
                        throw new Error('Invalid Base64 string');
                    }

                    const contentType = parts[0].split(':')[1].split(';')[0];
                    const byteCharacters = atob(parts[1]);
                    const byteNumbers = new Array(byteCharacters.length);
                    for (let i = 0; i < byteCharacters.length; i++) {
                        byteNumbers[i] = byteCharacters.charCodeAt(i);
                    }
                    const byteArray = new Uint8Array(byteNumbers);
                    let blob = new Blob([byteArray], { type: contentType });
                    const url = URL.createObjectURL(blob);
                    this.img = url
                } catch (err) {
                    console.log(err)
                }
            },
            UplaodImg(file) {
                const reader = new FileReader();
                let db = this.database
                reader.onload = function () {
                    try {
                        this.loader = true
                        const base64 = reader.result;
                        const parts = base64.split(',');
                        if (parts.length !== 2) {
                            throw new Error('Invalid Base64 string');
                        }

                        const contentType = parts[0].split(':')[1].split(';')[0];
                        const byteCharacters = atob(parts[1]);
                        const byteNumbers = new Array(byteCharacters.length);
                        for (let i = 0; i < byteCharacters.length; i++) {
                            byteNumbers[i] = byteCharacters.charCodeAt(i);
                        }
                        const byteArray = new Uint8Array(byteNumbers);
                        let blob = new Blob([byteArray], { type: contentType });
                        const url = URL.createObjectURL(blob);
                        let user = db.users.find((v) => v.id = db.user?.id) || {}
                        if (user.id) {
                            user['img'] = base64
                            user.img = base64
                            localStorage.setItem('users', JSON.stringify(db.users))
                            localStorage.setItem('userData', JSON.stringify(user))
                        }
                        this.loader = false
                    } catch (err) {
                        console.log(err)
                    }


                };

                reader.readAsDataURL(file);
            },

            InitUpload() {
                let mm = document.getElementById("fileUpload")
                console.log(mm.click())
                document.getElementById("fileUpload").click();
            },
            SwitchCard() {
                if (this.cardView == true) {
                    this.cardView = false
                    this.Notify('Switching To Back Of Card', 'positive')
                }

                if (this.cardView == false) {
                    this.cardView = true
                    this.Notify('Switching To Front Of Card', 'positive')
                }
            },
            GenerateIdCard() {
                console.log(this.database)
                if (this.database.user?.isGenerated) {
                    this.dialog = true
                } else {
                    this.loader = true
                    setTimeout(() => {
                        let user = this.database.users.find((v) => v.id = this.database.user?.id) || {}
                        if (user.id) {
                            user['isGenerated'] = true
                            this.database.user.isGenerated = true
                            localStorage.setItem('users', JSON.stringify(this.database.users))
                            localStorage.setItem('user', JSON.stringify(this.database.user))
                        }
                        this.loader = false
                        this.dialog = true
                        this.Notify('ID Card Generated Successfull', 'positive')
                        console.log(this.database)
                    }, 5000)
                }
            },
            Notify(message, type) {
                let notify = document.querySelector('.notify')
                notify.style.right = "10px"
                this.notify = true
                this.config.message = message
                this.config.type = type
                setTimeout(() => {
                    notify.style.right = "-200px"
                    this.notify = false
                    this.config = {}
                }, 3000)
            },
            initDatabase(type = '', data = {}) {
                if (type == 'get') {
                    let users = JSON.parse(localStorage.getItem('users')) || []
                    let user = JSON.parse(localStorage.getItem('userData')) || {}
                    if (users.length > 0) {
                        this.database.users = users
                        this.database.user = user
                        this.uid = user.id
                        this.user = user
                        if (this.database?.user?.id && this.user.img) {
                            console.log(this.database.user)
                            this.base64Url(this.database.user.img)

                        }
                    } else {
                        this.database.users = []
                        this.database.users.push({ id: '862397hjhkku9d793', email: 'testing@gmail.com', firstName: 'John', lastName: 'Doe', username: 'johndoe', gender: 'male', age: 23, password: 'Testing@12', img: '', matricNo: '12354783', dob: '1998-23-05' })
                    }
                    localStorage.setItem('users', JSON.stringify(this.database.users))

                }
                if (type == 'update') {
                    this.database.users.push(data)
                    localStorage.setItem('users', JSON.stringify(this.database.users))
                    localStorage.setItem('userData', JSON.stringify(this.database.user))
                }



            },
            Login() {
                try {
                    this.loading = true
                    setTimeout(() => {
                        console.log(this.loginForm)
                        let user = this.database.users.find((v) => (v.email == this.loginForm.username || v.username == this.loginForm.username || v.matricNo == this.loginForm.username) && v.password == this.loginForm.password) || null
                        console.log(user)
                        if (user?.id) {
                            localStorage.setItem('activeUser', user?.id)
                            localStorage.setItem('userData', JSON.stringify(user))
                            this.uid = user.id
                            this.user = user
                            this.Notify('Logged in successfull', 'positive')
                            location.reload()
                        } else {
                            this.Notify('Invalid credentias', 'negative')
                            throw { msg: 'Invalid login detalils' }
                        }
                    }, 4000)


                } catch (err) {
                    console.log(err)
                    this.loading = false
                    alert(err.msg ? err.msg : 'Unkonown Error Occured')
                }
            },
            Logout() {
                localStorage.removeItem('activeUser')
                localStorage.removeItem('userData')
                this.uid = null
                this.database.user = null
                this.Notify('Logout successful', 'positive')
                location.reload()
            },
            Register() {
                try {
                    if (this.isValid2) {
                        this.dform.id = 'MEM' + Math.floor(Math.random() * 334849).toString()
                        this.initDatabase('update', this.dform)
                        this.dform = {}
                        this.Notify('Registration Successfull', 'positive')
                        this.auth = 'login'
                    } else {
                        this.Notify('Fields required', 'negative')

                    }


                } catch (err) {
                    console.log(err)
                    this.loading = false
                    alert(err.msg ? err.msg : 'Unkonown Error Occured')
                }
            }

        },
        created() {

        },
        mounted() {
            this.initDatabase('get')

        },
    })

    app.use(Quasar, {
        plugins: {
            Notify
        },
    })
    app.mount('#app')
});


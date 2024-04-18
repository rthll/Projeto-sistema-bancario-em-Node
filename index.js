import inquirer from 'inquirer';
import chalk from 'chalk'
import fs from 'fs'

console.log("Iniciamos")

operation()

function operation() {
    
    inquirer.prompt([
    {
        type: 'list',
        name: 'action',
        message: 'O que você deseja fazer?',
        choices: [
            'Criar conta',
            'Consultar saldo',
            'Depositar',
            'Sacar',
            'Sair'
        ],
    },
]).then((answer) => {

    const action = answer['action']
    if(action === 'Criar conta') {
        createAccount()
    } else if(action === 'Consultar saldo') {
        getAccountBalance()
    } else if(action === 'Depositar') {
        deposit()
    } else if(action === 'Sacar') {
        withdraw()
    } else if(action === 'Sair') {
        console.log(chalk.bgBlue.black('Obrigado por usar o Accounts!'))
        process.exit()
    }

})
.catch((err) => console.log(err))

}

function createAccount(){
    
    console.log(chalk.bgGreen.black('Parabéns por utilizar o Accounts!'))
    console.log(chalk.green('Defina as opções da sua conta a seguir!'))
    buildAccount()

}

function buildAccount() {

    inquirer.prompt([
        {
            name: 'accountName',
            message: 'Digite um nome para sua conta:'
        }
    ]).then((answer) => {

        const accountName = answer['accountName']
        console.info(accountName)

        if(!fs.existsSync('accounts')) {
            fs.mkdirSync('accounts')
        }

        if(fs.existsSync(`accounts/${accountName}.json`)) {
            console.log(chalk.bgRed.black('Esta conta já existe!'),
            )
            buildAccount()
            return
        }

        fs.writeFileSync(`accounts/${accountName}.json`, '{"balance": 0}', function (err) {
            console.log(err)
        },
    )

        console.log(chalk.green('Sucesso!'))
        operation()
    })
    .catch((err) => {

        console.log(err)

    })
}

function deposit() {

    inquirer.prompt([
        {
            name: 'accountName',
            message: 'Qual o nome da conta que deseja depositar?'
        }
    ])
    .then((answer) => {

        const accountName = answer['accountName']
        if(!checkAccount(accountName)){
            return deposit()
        }

        inquirer.prompt([
            {
                name: 'amount',
                message: 'Quanto você deseja depositar?'
            },
        ])
        .then((answer) => {

            const amount = answer['amount']
            addAmount(accountName, amount)
            operation()

        })
        .catch(err => console.log(err))

    })
    .catch(err => console.log(err))

}

function checkAccount(accountName) {

    if(!fs.existsSync(`accounts/${accountName}.json`)) {
        console.log(chalk.bgRed.black('Esta conta não existe, tente novamente!'))
        return false
    }

    return true

}

function addAmount(accountName, amount) {

    const accountData = getAccount(accountName)

    if(!amount) {
        console.log('Ocorreu um erro!')
        return deposit()
    }
    accountData.balance = parseFloat(amount) + parseFloat(accountData.balance)
    fs.writeFileSync(
        `accounts/${accountName}.json`,
        JSON.stringify(accountData), function (err) {
            console.log(err)
        },
    )

    console.log(chalk.green(`Foi depositado o valor de R$${amount}`))
}

function getAccount(accountName) {
    const accountJSON = fs.readFileSync(`accounts/${accountName}.json`, {
    encoding: 'utf8', flag: 'r'})

    return JSON.parse(accountJSON)

}

function getAccountBalance() {
    inquirer.prompt([
        {
            name: 'accountName',
            message: 'Digite o nome da sua conta?'
        }
    ])
    .then((answer) => {
        const accountName = answer["accountName"]
        if(!checkAccount(accountName)) {
            return getAccountBalance()
        }

        const accountData = getAccount(accountName)

        console.log(chalk.bgBlue.black(`Olá, o saldo da sua conta é de R$ ${accountData.balance}`,
        ),
        )
        operation()

    })
    .catch(err => console.log(err))
}


function removeAmount(accountName, amount) {

    const accountData = getAccount(accountName)

    if(!amount) {
        console.log('Ocorreu um erro!')
        return deposit()
    }
    accountData.balance = parseFloat(accountData.balance) - parseFloat(amount)
    fs.writeFileSync(
        `accounts/${accountName}.json`,
        JSON.stringify(accountData), function (err) {
            console.log(err)
        },
    )

    console.log(chalk.green(`Foi sacado o valor de R$${amount}`))
}


function withdraw() {

    inquirer.prompt([
        {
            name: 'accountName',
            message: 'Qual o nome da conta que deseja sacar?'
        }
    ])
    .then((answer) => {

        const accountName = answer['accountName']
        if(!checkAccount(accountName)){
            return withdraw()
        }

        inquirer.prompt([
            {
                name: 'amount',
                message: 'Quanto você deseja sacar?'
            },
        ])
        .then((answer) => {

            const amount = answer['amount']
            removeAmount(accountName, amount)
            operation()

        })
        .catch(err => console.log(err))

    })
    .catch(err => console.log(err))

}
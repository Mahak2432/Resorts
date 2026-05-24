#include <bits/stdc++.h>
using namespace std;

abstract class DepositeAccount {
public:
    virtual void deposit() = 0;
};

abstract class withdrawAccount : public DepositeAccount {
    public:   
        virtual void withdraw() = 0;
};

class SavingAccount : public withdrawAccount {
    public:
        void deposit() {
            cout << "Deposit in saving account" << endl;
        }
        void withdraw() {
            cout << "Withdraw from saving account" << endl;
        }
};

class CurrentAccount : public withdrawAccount {
    public : 
        void override deposit() {
            cout << "Deposit in current account" << endl;
        }

        void override withdraw() {
            cout << "Withdraw from current account" << endl;
        }
}

class FixedAccount : public DepositAccount {
    public:
        void override deposit() {
            cout << "Deposit in fixed account" << endl;
        }
};

class Client {
    private : 
            vector<DepositAccount*> depositAccounts;
            vector<withdrawAccount*> withdrawAccounts;

    public : 

        void addDepositAccount(DepositAccount* account) {
            depositAccounts.push_back(account);
        }

        void addWithdrawAccount(withdrawAccount* account) {
            withdrawAccounts.push_back(account);
        }

        void performDeposit() {
            for (auto account : depositAccounts) {
                account->deposit();
            }
            for(auto account : withdrawAccounts) {
                account->deposit();
            }
        }

        void performWithdraw() {
            for(auto account : withdrawAccounts) {
                account->withdraw();
            }
        }

}


int main() {

    Client client;
    SavingAccount savingAccount;
    CurrentAccount currentAccount;
    FixedAccount fixedAccount;

    client.addDepositAccount(&savingAccount);
    client.addDepositAccount(&currentAccount);
    client.addDepositAccount(&fixedAccount);

    client.addWithdrawAccount(&savingAccount);
    client.addWithdrawAccount(&currentAccount);

    cout << "Performing deposit:" << endl;
    client.performDeposit();

    cout << "Performing withdraw:" << endl;
    client.performWithdraw();

    return 0;
}
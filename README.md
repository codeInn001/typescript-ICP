#  BLOG POST CANISTER
- Blog Post Canister is a TypeScript (Azle) project on the ICP (Internet Computer TypeScript) platform that performs CRUD (Create, Read, Update and Delete) operations.
- Blog Post Canister provides users with the ability to perform the following
  1. Create blog posts.
  2. See and comment on other users' blog posts.
  3. Get blog posts by their id.
  4. Edit and Update their blog posts.
  5. Delete blog posts.


## Preparing the Development Environment
### 1. Install Node Version Manager (nvm)
```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.3/install.sh | bash
```

### 2. Switch to Node.js version 18
```bash
nvm use 18
```

### 3. Install DFX
```bash
DFX_VERSION=0.14.1 sh -ci "$(curl -fsSL https://sdk.dfinity.org/install.sh)"
```

### 4. Add DFX to your path
```bash
echo 'export PATH="$PATH:$HOME/bin"' >> "$HOME/.bashrc"
```

### 5. Reload your terminal if using GitHub Codespaces
- This can be done by closing the terminal and opening a new terminal.

### 6. Starting the Local Internet Computer
```bash
dfx start --background
```

Your terminal will display an output similar to the one below.

![](https://github.com/ozo-vehe/recipe-canister/blob/main/image1.png)

## Deploying the Canister

- Next, we will compile our canister code and install it on the local network using the dfx deploy command:
```bash
dfx deploy
```

- Executing the dfx deploy command should result in an output similar to:

![](https://github.com/ozo-vehe/recipe-canister/blob/main/image2.png)



## :writing_hand: Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any
contributions you make are **greatly appreciated**.

If you have a suggestion to improve this, please fork the repo and create a pull request. You can also
simply open an issue with the tag "enhancement". Don't forget to give the project a star! Thanks again!

1. Fork the Project
2. Create your new feature branch (`git checkout -b feature/new_feature`)
3. Commit your changes (`git commit -m 'included a new feature(s)'`)
4. Push to the branch (`git push origin feature/new_feature`)
5. Open a pull request


<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->

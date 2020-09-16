# todo-app-graphql

todo-app の API(GraphQL)

## graphql-codegen

GraphQLの型定義の自動生成。
以下を実行すると`src/generated/graphql-types.ts`が作成される
```
yarn graphql-codegen --config codegen.yml
```

## 環境構築

### mongodb

```
brew tap mongodb/brew
brew install mongodb-community

# 起動
brew services start mongodb-community

# 停止
brew services stop mongodb-community
```

`mongo`を実行し以下で DB を作成する

```
use todo-db
db.createCollection("todos")
db.todos.insertOne({ id: "1", title: "買い物", done: false})
```

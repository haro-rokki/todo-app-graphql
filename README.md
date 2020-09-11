# todo-app-graphql

todo-app の API(GraphQL)

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

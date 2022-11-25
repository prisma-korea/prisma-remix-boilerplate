# Contribute style guide

- [Naming](#-Naming)
  - [Files](#-Files)
  - [Components](#-Components)
  - [Props, State](#-Props--state)
  - [Variables, Functions](#-Variables--Functions)
- [Declaration variables](#-Declaration-variables)
- [Export functions](#-Export-functions)
  - [Case 1](#-Case--1)
  - [Case 2](#-Case--2)
- [UI component rules](#-UI-component-rules)
- [Type declaration](#-Type-declaration)

## Naming

### Files

- Component files should be kebab-case and be same with component's name.
- None component files should be camelCase.
- Files running only on the server should have `.server` suffix.
- Files running only on the client should have `.client` suffix.
- The files for both sides don't need a suffix.

  ```sh
  // server only
  auth.server.ts

  // client only
  entry.client.tsx

  // both
  validator.ts
  ```

- Service functions file name should be the same with their domain name.
- Examples
  ```sh
  // It means that functions inside the file belongs to auth domain and runs on server.
  auth.server.ts
  ```

### Components

- The component name should be PascalCase.
- If the component is related to any domain, The name should be `<domain name> + <Verb>`.

  ```ts
  // don't
  function AddUser() {}

  // do
  function UserAdd() {}
  ```

### Props, State

- `props` or `state` name should be camelCase.
- The event `props` name should be `on` + `event name` + `event target name`.

  ```ts
  // don't
  <Foo press={} />;

  // don't
  <Foo onPress={} />;

  // do
  <Foo onPressHeader={} />;
  ```

- `state` conventions are similar with variables.
- `setState` should be camelCase and be `set` + `stateName`

### Variables, Functions

- Use descriptive variable name to show your intent.

  ```ts
  // don't
  const l = [...];

  // do
  const itemList = [...];
  ```

- Event handler name should be `handle` + `event name` + `target` or you can add descriptive subject to end of the name.

  ```ts
  // don't
  const handleClick = () => {};

  <button onClick={handleClick}>profile</button>;

  // do
  const handleClickProfile = () => {};

  <button onClick={handleClickProfile}>profile</button>;
  ```

- Ambiguous boolean type props can have a prefix `is`, `has` or `should`. But if they have obvious meaning like `loading`, `disabled`, `checked`, a prefix isn't needed.

  ```ts
  // don't
  <Foo value={false}/>

  // do
  <Foo hasValue={false} />

  // do
  <Foo loading />
  ```

- When function returns `Promise` or is async function, you should add suffix `async` to the end of the function name.

  ```ts
  // don't
  function read() {
    return new Promise();
  }

  // do
  function readAsync() {
    return new Promise();
  }

  // do
  async function readAsync() {
    await asyncWork();

    return;
  }
  ```

---

## Declaration variables

- Write `const` as possible as you can. Use `let` when you need to reassign a variable.

---

## Export functions

### case 1

- Functions related to same domain should be exported with single object like below.

  ```ts
  const methodA () {}
  const methodB () {}

  export default {methodA, methodB};
  ```

### case 2

- If some functions are placed in a single file, they can be exported separately.

  ```ts
  export const functionA () {}
  export const functionB () {}
  ```

---

## UI component rules

- You have to make UI components as simple as possible.
- Component declaration should be function then use `export default`.

  ```ts
  // don't
  const Comp = () => {};

  export default Comp;

  // do
  export default function Comp() {}
  ```

- When you think the component needs other files, place them in one folder. Then export a result component in `index` file. The folder name should have same name with the component's name.
  ```sh
  ├── edit-text
  │   ├── input.tsx
  │   ├── loading-indicator.tsx
  │   └── index.tsx
  ```
- When you need to show a component conditionally, We prefer to use ternary operator then `&&` operator. You can refer [here](https://kentcdodds.com/blog/use-ternaries-rather-than-and-and-in-jsx), if you want to know the reason.

  ```ts
      // don't
      {list.length && <div>{list.map((item) => (...))}</div>}

      // do
      {list.length ? <div>{list.map((item) => (...))}</div> : null}
  ```

- If there are same conditions used multiple times inside props, extract them to conditional statement like below.

  ```ts
  // don't
  function Parent() {
    const [isHighlighted, setIsHighlighted] = useState(false);

    return (
      <div>
        <Child
          style={...{isHighlighted ? {color: '#fff'} : undefined}}
          headerColor={isHighlighted ? 'red' : 'blue'}
        />
      </div>
    );
  }

  // do
  function Parent() {
    const [isHighlighted, setIsHighlighted] = useState(false);

    if(isHighlighted) {
      return (
        <div>
          <Child
            style={{color: '#fff'}}
            headerColor='red'
          />
      </div>
      )
    }

    return (
      <div>
        <Child
          headerColor='blue'
        />
      </div>
    );
  }
  ```

- The component style should be fully customizable. Also, try to place style props into single object to simplifying style props.

  ```ts
  type ClassNames = {
    label?: string;
    input?: string;
    error?: string;
  };

  interface Props {
    classNames?: ClassNames;
  }
  ```

- Try to offer `render` function. A user can customize a piece of the component with their own way.

  ```ts
  // A user can use leftElement like below
  <Button
    text="button text"
    leftElement={<LikeIcon />}
    rightElement={<LikeIcon />}
    color="danger"
  />

  // with render function
  <Button
    text="button text"
    leftElement={(props) => (
      <div className="text-default-contrast w-48" {...props}><LikeIcon/></div>
    )}
    classNames={{contents: 'justify-start'}}
  />
  ```

---

## Type declaration

- We prefer to use `type` instead of `interface`.

  ```ts
  type Props & DetailedHTMLProps<
      InputHTMLAttributes<HTMLInputElement>,
      HTMLInputElement
    > {
    id?: string;
    htmlFor: string;
    label: string;
    className?: string;
    type?: string;
    value?: any;
    error?: string;
  }
  ```

- Don't inject type when it can be inferred.

  ```ts
  // don't
  function Comp() {
    const [state, setState] = useState<boolean>(false);
  }

  // do
  function Comp() {
    const [state, setState] = useState(false);
  }
  ```

- We prefer to declare a component type in same place that a component is declared. Props type name is just `Props` except for multiple components in single file.

  ```ts
  // do
  type Props = {
    content: string;
  };

  function Comp({content}: Props) {
    return (
      ...
    )
  }

  // When more then 2 components in same file, You can declare props type like below

  type ChildrenAProps = {};

  function ChildrenA(props: ChildrenAProps) {
    return (
      ...
    )
  }

  type ChildrenBProps = {};

  function ChildrenB(props: ChildrenBProps) {
    return (
      ...
    )
  }
  ```

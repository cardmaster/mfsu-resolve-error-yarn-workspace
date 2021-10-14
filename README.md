

## What happens?

When using umi-app inside yarn workspace, after enabling mfsu, it'll report build error for import below types of packages:

1. package inside this workspaces, e.g. packages/umi-app imported packages/a
2. package path with '/', e.g. '@ant-design/icons', 'react-icons/gr'.

Error were in this format:
```
Module build failed (from ../../node_modules/@umijs/deps/compiled/babel-loader/index.js):
AssertionError [ERR_ASSERTION]: [MFSU] package.json not found for dep @ant-design/icons which is imported from C:\work\Leaf\readlogs\wkspace\packages\testmfsu\src\pages\index.tsx
```

**NOTE**: all this works fine without mfsu

## How To Reproduce

### Failed to Resolve @ant-design/icons in Yarn Workspace

Create yarn workspace:

wkspace/package.json
```json
{
  "private": true,
  "name": "front-end-mono-repo",
  "devDependencies": {
    "prettier": "^2.4.1"
  },
  "workspaces": [
    "packages/*"
  ],
  "scripts": {
  }
}
```

Then create umiapp as a package in this workspace:

```shell
mkdir packages
cd packages
mkdir testmfsu
cd testmfsu
yarn create @umijs/umi-app
```

Set name/version in the app package.json and enable mfsu.

The `.umi.ts` file:

Go back to workspace and install.
```
cd ..
cd ..
yarn 
```

Then try launch umi dev server:
```
yarn workspace testmfsu start
```

Or same thing:

```
cd packages
cd testmfsu
yarn start
```

It works here.




Then try to import @ant-design/icons

```
yarn workspace testmfsu add @ant-design/icons antd
```

And use icons in the `src/pages/index.tsx` like this:

```typescript
import {Button} from 'antd';
import {DownloadOutlined} from '@ant-design/icons';
import 'antd/dist/antd.css'

export default function IndexPage() {
  return (
    <div>
      <Button icon={<DownloadOutlined />}>Download</Button>
    </div>
  );
}

```

Then I got this error:
```

× Webpack


 ERROR  Failed to compile with 1 errors                                                                       1:39:43 PM

 error  in ./src/pages/index.tsx

Module build failed (from ../../node_modules/@umijs/deps/compiled/babel-loader/index.js):
AssertionError [ERR_ASSERTION]: [MFSU] package.json not found for dep @ant-design/icons which is imported from C:\work\Leaf\readlogs\wkspace\packages\testmfsu\src\pages\index.tsx
    at getDepVersion (C:\work\Leaf\readlogs\wkspace\node_modules\umi\node_modules\@umijs\preset-built-in\lib\plugins\features\mfsu\getDepVersion.js:129:27)
    at DepInfo.addTmpDep (C:\work\Leaf\readlogs\wkspace\node_modules\umi\node_modules\@umijs\preset-built-in\lib\plugins\features\mfsu\DepInfo.js:141:56)
    at Object.onTransformDeps (C:\work\Leaf\readlogs\wkspace\node_modules\umi\node_modules\@umijs\preset-built-in\lib\plugins\features\mfsu\mfsu.js:327:23)
    at PluginPass.exit (C:\work\Leaf\readlogs\wkspace\node_modules\@umijs\babel-plugin-import-to-await-require\lib\index.js:217:140)
    at newFn (C:\work\Leaf\readlogs\wkspace\node_modules\@umijs\deps\compiled\babel\bundle.js:62022:21)
    at NodePath._call (C:\work\Leaf\readlogs\wkspace\node_modules\@umijs\deps\compiled\babel\bundle.js:56841:20)
    at NodePath.call (C:\work\Leaf\readlogs\wkspace\node_modules\@umijs\deps\compiled\babel\bundle.js:56828:17)
    at NodePath.visit (C:\work\Leaf\readlogs\wkspace\node_modules\@umijs\deps\compiled\babel\bundle.js:56887:8)
    at TraversalContext.visitQueue (C:\work\Leaf\readlogs\wkspace\node_modules\@umijs\deps\compiled\babel\bundle.js:56353:16)
    at TraversalContext.visitSingle (C:\work\Leaf\readlogs\wkspace\node_modules\@umijs\deps\compiled\babel\bundle.js:56322:19)

```

Same issues appears for react-icons too, example:
```typescript
import {GrApple} from 'react-icons/gr'
//...
<Button icon={<GrApple />}>Download</Button>
//...
```

### Failed to Resolve Package in Same workspace

e.g.

```
cd packages
mkdir icon-bridge
cd icon-bridge
yarn create @umijs/dumi-lib
```

with a very simple index.ts:

```typescript
import React from 'react';

export const DownloadOutlined = ()=>{
    return React.createElement("span", undefined, "YEAH");
}
```

Then build it and start umi-app afterward:

```
yarn workspace icon-bridge build
```

And remove usage of antd icons first:

```typescript
import React from 'react';
import {Button} from 'antd';
import 'antd/dist/antd.css'
import {DownloadOutlined} from 'icon-bridge'
//import { DownloadOutlined as AntDownload } from '@ant-design/icons';

export default function IndexPage() {
  return (
    <div>
      <Button icon={<DownloadOutlined />}>Download</Button>
//      <Button icon={<AntDownload />}>Download ICON</Button>
    </div>
  );
}

```

Then we have similliar error too:

```
yarn start
```

```
 ERROR  Failed to compile with 1 errors                                                                       2:18:57 PM

 error  in ./src/pages/index.tsx

Module build failed (from ../../node_modules/@umijs/deps/compiled/babel-loader/index.js):
AssertionError [ERR_ASSERTION]: [MFSU] package.json not found for dep icon-bridge which is imported from C:\work\Leaf\readlogs\wkspace\packages\testmfsu\src\pages\index.tsx
    at getDepVersion (C:\work\Leaf\readlogs\wkspace\node_modules\umi\node_modules\@umijs\preset-built-in\lib\plugins\features\mfsu\getDepVersion.js:129:27)
    at DepInfo.addTmpDep (C:\work\Leaf\readlogs\wkspace\node_modules\umi\node_modules\@umijs\preset-built-in\lib\plugins\features\mfsu\DepInfo.js:141:56)
    at Object.onTransformDeps (C:\work\Leaf\readlogs\wkspace\node_modules\umi\node_modules\@umijs\preset-built-in\lib\plugins\features\mfsu\mfsu.js:327:23)
    at PluginPass.exit (C:\work\Leaf\readlogs\wkspace\node_modules\@umijs\babel-plugin-import-to-await-require\lib\index.js:217:140)
    at newFn (C:\work\Leaf\readlogs\wkspace\node_modules\@umijs\deps\compiled\babel\bundle.js:62022:21)
    at NodePath._call (C:\work\Leaf\readlogs\wkspace\node_modules\@umijs\deps\compiled\babel\bundle.js:56841:20)
    at NodePath.call (C:\work\Leaf\readlogs\wkspace\node_modules\@umijs\deps\compiled\babel\bundle.js:56828:17)
    at NodePath.visit (C:\work\Leaf\readlogs\wkspace\node_modules\@umijs\deps\compiled\babel\bundle.js:56887:8)
    at TraversalContext.visitQueue (C:\work\Leaf\readlogs\wkspace\node_modules\@umijs\deps\compiled\babel\bundle.js:56353:16)
    at TraversalContext.visitSingle (C:\work\Leaf\readlogs\wkspace\node_modules\@umijs\deps\compiled\babel\bundle.js:56322:19)
```

## Context

- **Umi Version**: 3.5.20
- **Node Version**: v14.18.0
- **Platform**: Windows 10 build 18363
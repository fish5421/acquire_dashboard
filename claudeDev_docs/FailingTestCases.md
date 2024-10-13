# Failing Test Cases

## src/__tests__/ConcurrentActions.test.jsx

### Concurrent User Actions Handles rapid filter changes correctly
```
Error: [2mexpect([22m[31mreceived[39m[2m).toBeInTheDocument()[22m

[31mreceived[39m value must be an HTMLElement or an SVGElement.
Received has value: [31mnull[39m

Ignored nodes: comments, script, style
[36m<html>[39m
  [36m<head />[39m
  [36m<body>[39m
    [36m<div>[39m
      [36m<div>[39m
        [36m<div[39m
          [33mclass[39m=[32m"App"[39m
        [36m>[39m
          [36m<div[39m
            [33mclass[39m=[32m"flex h-screen bg-white"[39m
          [36m>[39m
            [36m<div[39m
              [33mclass[39m=[32m"flex flex-col w-64 bg-white border-r border-gray-200 h-screen"[39m
            [36m>[39m
              [36m<div[39m
                [33mclass[39m=[32m"flex items-center justify-center h-16 border-b border-gray-200"[39m
              [36m>[39m
                [36m<span[39m
                  [33mclass[39m=[32m"text-gray-900 font-bold text-lg"[39m
                [36m>[39m
                  [0mMicro Startup Dashboard[0m
                [36m</span>[39m
              [36m</div>[39m
              [36m<nav[39m
                [33mclass[39m=[32m"flex-1"[39m
              [36m>[39m
                [36m<ul[39m
                  [33mclass[39m=[32m"space-y-2 py-4"[39m
                [36m>[39m
                  [36m<li>[39m
                    [36m<a[39m
                      [33mclass[39m=[32m"flex items-center px-4 py-2 text-sm font-medium bg-gray-200 text-gray-900"[39m
                      [33mhref[39m=[32m"/"[39m
                    [36m>[39m
                      [36m<svg[39m
                        [33mclass[39m=[32m"lucide lucide-house mr-3 h-6 w-6"[39m
                        [33mfill[39m=[32m"none"[39m
                        [33mheight[39m=[32m"24"[39m
                        [33mstroke[39m=[32m"currentColor"[39m
                        [33mstroke-linecap[39m=[32m"round"[39m
                        [33mstroke-linejoin[39m=[32m"round"[39m
                        [33mstroke-width[39m=[32m"2"[39m
                        [33mviewBox[39m=[32m"0 0 24 24"[39m
                        [33mwidth[39m=[32m"24"[39m
                        [33mxmlns[39m=[32m"http://www.w3.org/2000/svg"[39m
                      [36m>[39m
                        [36m<path[39m
                          [33md[39m=[32m"M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"[39m
                        [36m/>[39m
                        [36m<path[39m
                          [33md[39m=[32m"M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"[39m
                        [36m/>[39m
                      [36m</svg>[39m
                      [0mDashboard[0m
                    [36m</a>[39m
                  [36m</li>[39m
                  [36m<li>[39m
                    [36m<a[39m
                      [33mclass[39m=[32m"flex items-center px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900"[39m
                      [33mhref[39m=[32m"/file-management"[39m
                    [36m>[39m
                      [36m<svg[39m
                        [33mclass[39m=[32m"lucide lucide-file-text mr-3 h-6 w-6"[39m
                        [33mfill[39m=[32m"none"[39m
                        [33mheight[39m=[32m"24"[39m
                        [33mstroke[39m=[32m"currentColor"[39m
                        [33mstroke-linecap[39m=[32m"round"[39m
                        [33mstroke-linejoin[39m=[32m"round"[39m
                        [33mstroke-width[39m=[32m"2"[39m
                        [33mviewBox[39m=[32m"0 0 24 24"[39m
                        [33mwidth[39m=[32m"24"[39m
                        [33mxmlns[39m=[32m"http://www.w3.org/2000/svg"[39m
                      [36m>[39m
                        [36m<path[39m
                          [33md[39m=[32m"M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"[39m
                        [36m/>[39m
                        [36m<path[39m
                          [33md[39m=[32m"M14 2v4a2 2 0 0 0 2 2h4"[39m
                        [36m/>[39m
                        [36m<path[39m
                          [33md[39m=[32m"M10 9H8"[39m
                        [36m/>[39m
                        [36m<path[39m
                          [33md[39m=[32m"M16 13H8"[39m
                        [36m/>[39m
                        [36m<path[39m
                          [33md[39m=[32m"M16 17H8"[39m
                        [36m/>[39m
                      [36m</svg>[39m
                      [0mFile Management[0m
                    [36m</a>[39m
                  [36m</li>[39m
                [36m</ul>[39m
              [36m</nav>[39m
              [36m<div[39m
                [33mclass[39m=[32m"p-4 space-y-2"[39m
              [36m>[39m
                [36m<h3[39m
                  [33mclass[39m=[32m"text-sm font-semibold text-gray-600 mb-2"[39m
                [36m>[39m
                  [0mQuick Actions[0m
                [36m</h3>[39m
                [36m<div[39m
                  [33mtabindex[39m=[32m"0"[39m
                [36m>[39m
                  [36m<button[39m
                    [33mclass[39m=[32m"whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-neutral-950 disabled:pointer-events-none disabled:opacity-50 dark:focus-visible:ring-neutral-300 bg-neutral-900 text-neutral-50 shadow hover:bg-neutral-900/90 dark:bg-neutral-50 dark:text-neutral-900 dark:hover:bg-neutral-50/90 h-9 px-4 py-2 w-full flex items-center justify-center"[39m
                  [36m>[39m
                    [36m<svg[39m
                      [33mclass[39m=[32m"lucide lucide-upload mr-2 h-4 w-4"[39m
                      [33mfill[39m=[32m"none"[39m
                      [33mheight[39m=[32m"24"[39m
                      [33mstroke[39m=[32m"currentColor"[39m
                      [33mstroke-linecap[39m=[32m"round"[39m
                      [33mstroke-linejoin[39m=[32m"round"[39m
                      [33mstroke-width[39m=[32m"2"[39m
                      [33mviewBox[39m=[32m"0 0 24 24"[39m
                      [33mwidth[39m=[32m"24"[39m
                      [33mxmlns[39m=[32m"http://www.w3.org/2000/svg"[39m
                    [36m>[39m
                      [36m<path[39m
                        [33md[39m=[32m"M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"[39m
                      [36m/>[39m
                      [36m<polyline[39m
                        [33mpoints[39m=[32m"17 8 12 3 7 8"[39m
                      [36m/>[39m
                      [36m<line[39m
                        [33mx1[39m=[32m"12"[39m
                        [33mx2[39m=[32m"12"[39m
                        [33my1[39m=[32m"3"[39m
                        [33my2[39m=[32m"15"[39m
                      [36m/>[39m
                    [36m</svg>[39m
                    [0mUpload File[0m
         ...
    at __EXTERNAL_MATCHER_TRAP__ (/home/runner/FirsthandHorribleScientists/node_modules/expect/build/index.js:325:30)
    at Object.throwingMatcher [as toBeInTheDocument] (/home/runner/FirsthandHorribleScientists/node_modules/expect/build/index.js:326:15)
    at toBeInTheDocument (/home/runner/FirsthandHorribleScientists/src/__tests__/ConcurrentActions.test.jsx:62:51)
    at runWithExpensiveErrorDiagnosticsDisabled (/home/runner/FirsthandHorribleScientists/node_modules/@testing-library/react/node_modules/@testing-library/dom/dist/config.js:47:12)
    at checkCallback (/home/runner/FirsthandHorribleScientists/node_modules/@testing-library/react/node_modules/@testing-library/dom/dist/wait-for.js:124:77)
    at checkRealTimersCallback (/home/runner/FirsthandHorribleScientists/node_modules/@testing-library/react/node_modules/@testing-library/dom/dist/wait-for.js:118:16)
    at Timeout.task [as _onTimeout] (/home/runner/FirsthandHorribleScientists/node_modules/jsdom/lib/jsdom/browser/Window.js:520:19)
    at listOnTimeout (node:internal/timers:581:17)
    at processTimers (node:internal/timers:519:7)
```

### Concurrent User Actions Handles simultaneous file uploads correctly
```
Error: [2mexpect([22m[31mreceived[39m[2m).toBeInTheDocument()[22m

[31mreceived[39m value must be an HTMLElement or an SVGElement.
Received has value: [31mnull[39m

Ignored nodes: comments, script, style
[36m<html>[39m
  [36m<head />[39m
  [36m<body>[39m
    [36m<div>[39m
      [36m<div>[39m
        [36m<div[39m
          [33mclass[39m=[32m"App"[39m
        [36m>[39m
          [36m<div[39m
            [33mclass[39m=[32m"flex h-screen bg-white"[39m
          [36m>[39m
            [36m<div[39m
              [33mclass[39m=[32m"flex flex-col w-64 bg-white border-r border-gray-200 h-screen"[39m
            [36m>[39m
              [36m<div[39m
                [33mclass[39m=[32m"flex items-center justify-center h-16 border-b border-gray-200"[39m
              [36m>[39m
                [36m<span[39m
                  [33mclass[39m=[32m"text-gray-900 font-bold text-lg"[39m
                [36m>[39m
                  [0mMicro Startup Dashboard[0m
                [36m</span>[39m
              [36m</div>[39m
              [36m<nav[39m
                [33mclass[39m=[32m"flex-1"[39m
              [36m>[39m
                [36m<ul[39m
                  [33mclass[39m=[32m"space-y-2 py-4"[39m
                [36m>[39m
                  [36m<li>[39m
                    [36m<a[39m
                      [33mclass[39m=[32m"flex items-center px-4 py-2 text-sm font-medium bg-gray-200 text-gray-900"[39m
                      [33mhref[39m=[32m"/"[39m
                    [36m>[39m
                      [36m<svg[39m
                        [33mclass[39m=[32m"lucide lucide-house mr-3 h-6 w-6"[39m
                        [33mfill[39m=[32m"none"[39m
                        [33mheight[39m=[32m"24"[39m
                        [33mstroke[39m=[32m"currentColor"[39m
                        [33mstroke-linecap[39m=[32m"round"[39m
                        [33mstroke-linejoin[39m=[32m"round"[39m
                        [33mstroke-width[39m=[32m"2"[39m
                        [33mviewBox[39m=[32m"0 0 24 24"[39m
                        [33mwidth[39m=[32m"24"[39m
                        [33mxmlns[39m=[32m"http://www.w3.org/2000/svg"[39m
                      [36m>[39m
                        [36m<path[39m
                          [33md[39m=[32m"M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"[39m
                        [36m/>[39m
                        [36m<path[39m
                          [33md[39m=[32m"M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"[39m
                        [36m/>[39m
                      [36m</svg>[39m
                      [0mDashboard[0m
                    [36m</a>[39m
                  [36m</li>[39m
                  [36m<li>[39m
                    [36m<a[39m
                      [33mclass[39m=[32m"flex items-center px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900"[39m
                      [33mhref[39m=[32m"/file-management"[39m
                    [36m>[39m
                      [36m<svg[39m
                        [33mclass[39m=[32m"lucide lucide-file-text mr-3 h-6 w-6"[39m
                        [33mfill[39m=[32m"none"[39m
                        [33mheight[39m=[32m"24"[39m
                        [33mstroke[39m=[32m"currentColor"[39m
                        [33mstroke-linecap[39m=[32m"round"[39m
                        [33mstroke-linejoin[39m=[32m"round"[39m
                        [33mstroke-width[39m=[32m"2"[39m
                        [33mviewBox[39m=[32m"0 0 24 24"[39m
                        [33mwidth[39m=[32m"24"[39m
                        [33mxmlns[39m=[32m"http://www.w3.org/2000/svg"[39m
                      [36m>[39m
                        [36m<path[39m
                          [33md[39m=[32m"M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"[39m
                        [36m/>[39m
                        [36m<path[39m
                          [33md[39m=[32m"M14 2v4a2 2 0 0 0 2 2h4"[39m
                        [36m/>[39m
                        [36m<path[39m
                          [33md[39m=[32m"M10 9H8"[39m
                        [36m/>[39m
                        [36m<path[39m
                          [33md[39m=[32m"M16 13H8"[39m
                        [36m/>[39m
                        [36m<path[39m
                          [33md[39m=[32m"M16 17H8"[39m
                        [36m/>[39m
                      [36m</svg>[39m
                      [0mFile Management[0m
                    [36m</a>[39m
                  [36m</li>[39m
                [36m</ul>[39m
              [36m</nav>[39m
              [36m<div[39m
                [33mclass[39m=[32m"p-4 space-y-2"[39m
              [36m>[39m
                [36m<h3[39m
                  [33mclass[39m=[32m"text-sm font-semibold text-gray-600 mb-2"[39m
                [36m>[39m
                  [0mQuick Actions[0m
                [36m</h3>[39m
                [36m<div[39m
                  [33mtabindex[39m=[32m"0"[39m
                [36m>[39m
                  [36m<button[39m
                    [33mclass[39m=[32m"whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-neutral-950 disabled:pointer-events-none disabled:opacity-50 dark:focus-visible:ring-neutral-300 bg-neutral-900 text-neutral-50 shadow hover:bg-neutral-900/90 dark:bg-neutral-50 dark:text-neutral-900 dark:hover:bg-neutral-50/90 h-9 px-4 py-2 w-full flex items-center justify-center"[39m
                  [36m>[39m
                    [36m<svg[39m
                      [33mclass[39m=[32m"lucide lucide-upload mr-2 h-4 w-4"[39m
                      [33mfill[39m=[32m"none"[39m
                      [33mheight[39m=[32m"24"[39m
                      [33mstroke[39m=[32m"currentColor"[39m
                      [33mstroke-linecap[39m=[32m"round"[39m
                      [33mstroke-linejoin[39m=[32m"round"[39m
                      [33mstroke-width[39m=[32m"2"[39m
                      [33mviewBox[39m=[32m"0 0 24 24"[39m
                      [33mwidth[39m=[32m"24"[39m
                      [33mxmlns[39m=[32m"http://www.w3.org/2000/svg"[39m
                    [36m>[39m
                      [36m<path[39m
                        [33md[39m=[32m"M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"[39m
                      [36m/>[39m
                      [36m<polyline[39m
                        [33mpoints[39m=[32m"17 8 12 3 7 8"[39m
                      [36m/>[39m
                      [36m<line[39m
                        [33mx1[39m=[32m"12"[39m
                        [33mx2[39m=[32m"12"[39m
                        [33my1[39m=[32m"3"[39m
                        [33my2[39m=[32m"15"[39m
                      [36m/>[39m
                    [36m</svg>[39m
                    [0mUpload File[0m
         ...
    at __EXTERNAL_MATCHER_TRAP__ (/home/runner/FirsthandHorribleScientists/node_modules/expect/build/index.js:325:30)
    at Object.throwingMatcher [as toBeInTheDocument] (/home/runner/FirsthandHorribleScientists/node_modules/expect/build/index.js:326:15)
    at toBeInTheDocument (/home/runner/FirsthandHorribleScientists/src/__tests__/ConcurrentActions.test.jsx:121:51)
    at runWithExpensiveErrorDiagnosticsDisabled (/home/runner/FirsthandHorribleScientists/node_modules/@testing-library/react/node_modules/@testing-library/dom/dist/config.js:47:12)
    at checkCallback (/home/runner/FirsthandHorribleScientists/node_modules/@testing-library/react/node_modules/@testing-library/dom/dist/wait-for.js:124:77)
    at checkRealTimersCallback (/home/runner/FirsthandHorribleScientists/node_modules/@testing-library/react/node_modules/@testing-library/dom/dist/wait-for.js:118:16)
    at Timeout.task [as _onTimeout] (/home/runner/FirsthandHorribleScientists/node_modules/jsdom/lib/jsdom/browser/Window.js:520:19)
    at listOnTimeout (node:internal/timers:581:17)
    at processTimers (node:internal/timers:519:7)
```

### Concurrent User Actions Handles rapid navigation between components
```
Error: Unable to find an element with the text: /Avg Revenue/i. This could be because the text is broken up by multiple elements. In this case, you can provide a function for your text matcher to make your matcher more flexible.

Ignored nodes: comments, script, style
[36m<body>[39m
  [36m<div>[39m
    [36m<div>[39m
      [36m<div[39m
        [33mclass[39m=[32m"App"[39m
      [36m>[39m
        [36m<div[39m
          [33mclass[39m=[32m"flex h-screen bg-white"[39m
        [36m>[39m
          [36m<div[39m
            [33mclass[39m=[32m"flex flex-col w-64 bg-white border-r border-gray-200 h-screen"[39m
          [36m>[39m
            [36m<div[39m
              [33mclass[39m=[32m"flex items-center justify-center h-16 border-b border-gray-200"[39m
            [36m>[39m
              [36m<span[39m
                [33mclass[39m=[32m"text-gray-900 font-bold text-lg"[39m
              [36m>[39m
                [0mMicro Startup Dashboard[0m
              [36m</span>[39m
            [36m</div>[39m
            [36m<nav[39m
              [33mclass[39m=[32m"flex-1"[39m
            [36m>[39m
              [36m<ul[39m
                [33mclass[39m=[32m"space-y-2 py-4"[39m
              [36m>[39m
                [36m<li>[39m
                  [36m<a[39m
                    [33mclass[39m=[32m"flex items-center px-4 py-2 text-sm font-medium bg-gray-200 text-gray-900"[39m
                    [33mhref[39m=[32m"/"[39m
                  [36m>[39m
                    [36m<svg[39m
                      [33mclass[39m=[32m"lucide lucide-house mr-3 h-6 w-6"[39m
                      [33mfill[39m=[32m"none"[39m
                      [33mheight[39m=[32m"24"[39m
                      [33mstroke[39m=[32m"currentColor"[39m
                      [33mstroke-linecap[39m=[32m"round"[39m
                      [33mstroke-linejoin[39m=[32m"round"[39m
                      [33mstroke-width[39m=[32m"2"[39m
                      [33mviewBox[39m=[32m"0 0 24 24"[39m
                      [33mwidth[39m=[32m"24"[39m
                      [33mxmlns[39m=[32m"http://www.w3.org/2000/svg"[39m
                    [36m>[39m
                      [36m<path[39m
                        [33md[39m=[32m"M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"[39m
                      [36m/>[39m
                      [36m<path[39m
                        [33md[39m=[32m"M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"[39m
                      [36m/>[39m
                    [36m</svg>[39m
                    [0mDashboard[0m
                  [36m</a>[39m
                [36m</li>[39m
                [36m<li>[39m
                  [36m<a[39m
                    [33mclass[39m=[32m"flex items-center px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900"[39m
                    [33mhref[39m=[32m"/file-management"[39m
                  [36m>[39m
                    [36m<svg[39m
                      [33mclass[39m=[32m"lucide lucide-file-text mr-3 h-6 w-6"[39m
                      [33mfill[39m=[32m"none"[39m
                      [33mheight[39m=[32m"24"[39m
                      [33mstroke[39m=[32m"currentColor"[39m
                      [33mstroke-linecap[39m=[32m"round"[39m
                      [33mstroke-linejoin[39m=[32m"round"[39m
                      [33mstroke-width[39m=[32m"2"[39m
                      [33mviewBox[39m=[32m"0 0 24 24"[39m
                      [33mwidth[39m=[32m"24"[39m
                      [33mxmlns[39m=[32m"http://www.w3.org/2000/svg"[39m
                    [36m>[39m
                      [36m<path[39m
                        [33md[39m=[32m"M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"[39m
                      [36m/>[39m
                      [36m<path[39m
                        [33md[39m=[32m"M14 2v4a2 2 0 0 0 2 2h4"[39m
                      [36m/>[39m
                      [36m<path[39m
                        [33md[39m=[32m"M10 9H8"[39m
                      [36m/>[39m
                      [36m<path[39m
                        [33md[39m=[32m"M16 13H8"[39m
                      [36m/>[39m
                      [36m<path[39m
                        [33md[39m=[32m"M16 17H8"[39m
                      [36m/>[39m
                    [36m</svg>[39m
                    [0mFile Management[0m
                  [36m</a>[39m
                [36m</li>[39m
              [36m</ul>[39m
            [36m</nav>[39m
            [36m<div[39m
              [33mclass[39m=[32m"p-4 space-y-2"[39m
            [36m>[39m
              [36m<h3[39m
                [33mclass[39m=[32m"text-sm font-semibold text-gray-600 mb-2"[39m
              [36m>[39m
                [0mQuick Actions[0m
              [36m</h3>[39m
              [36m<div[39m
                [33mtabindex[39m=[32m"0"[39m
              [36m>[39m
                [36m<button[39m
                  [33mclass[39m=[32m"whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-neutral-950 disabled:pointer-events-none disabled:opacity-50 dark:focus-visible:ring-neutral-300 bg-neutral-900 text-neutral-50 shadow hover:bg-neutral-900/90 dark:bg-neutral-50 dark:text-neutral-900 dark:hover:bg-neutral-50/90 h-9 px-4 py-2 w-full flex items-center justify-center"[39m
                [36m>[39m
                  [36m<svg[39m
                    [33mclass[39m=[32m"lucide lucide-upload mr-2 h-4 w-4"[39m
                    [33mfill[39m=[32m"none"[39m
                    [33mheight[39m=[32m"24"[39m
                    [33mstroke[39m=[32m"currentColor"[39m
                    [33mstroke-linecap[39m=[32m"round"[39m
                    [33mstroke-linejoin[39m=[32m"round"[39m
                    [33mstroke-width[39m=[32m"2"[39m
                    [33mviewBox[39m=[32m"0 0 24 24"[39m
                    [33mwidth[39m=[32m"24"[39m
                    [33mxmlns[39m=[32m"http://www.w3.org/2000/svg"[39m
                  [36m>[39m
                    [36m<path[39m
                      [33md[39m=[32m"M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"[39m
                    [36m/>[39m
                    [36m<polyline[39m
                      [33mpoints[39m=[32m"17 8 12 3 7 8"[39m
                    [36m/>[39m
                    [36m<line[39m
                      [33mx1[39m=[32m"12"[39m
                      [33mx2[39m=[32m"12"[39m
                      [33my1[39m=[32m"3"[39m
                      [33my2[39m=[32m"15"[39m
                    [36m/>[39m
                  [36m</svg>[39m
                  [0mUpload File[0m
                [36m</button>[39m
              [36m</div>[39m
              [36m<div[39m
                [33mtabindex[39m=[32m"0"[39m
              [36m>[39m
                [36m<button[39m
                  [33mclass[39m=[32m"whitespace-nowrap rounded-md text-sm font-medium transition-colors...
    at waitForWrapper (/home/runner/FirsthandHorribleScientists/node_modules/@testing-library/react/node_modules/@testing-library/dom/dist/wait-for.js:163:27)
    at _callee14$ (/home/runner/FirsthandHorribleScientists/src/__tests__/ConcurrentActions.test.jsx:157:18)
    at call (/home/runner/FirsthandHorribleScientists/src/__tests__/ConcurrentActions.test.jsx:2:1)
    at Generator.tryCatch (/home/runner/FirsthandHorribleScientists/src/__tests__/ConcurrentActions.test.jsx:2:1)
    at Generator._invoke [as next] (/home/runner/FirsthandHorribleScientists/src/__tests__/ConcurrentActions.test.jsx:2:1)
    at asyncGeneratorStep (/home/runner/FirsthandHorribleScientists/src/__tests__/ConcurrentActions.test.jsx:2:1)
    at asyncGeneratorStep (/home/runner/FirsthandHorribleScientists/src/__tests__/ConcurrentActions.test.jsx:2:1)
```
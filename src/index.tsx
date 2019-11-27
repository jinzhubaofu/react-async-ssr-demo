import React, { Suspense, useState } from 'react';
import { renderToStringAsync } from 'react-async-ssr';
import prettier from 'prettier';

const createResource = promise => {
  let status = 'pedding';
  let result;

  promise.then(
    r => {
      status = 'done';
      result = r;
    },
    e => {
      status = 'error';
      result = e;
    }
  );

  return {
    read() {
      switch (status) {
        case 'pedding':
          throw promise;
        case 'error':
          throw result;
        case 'done':
          return result;
      }
    }
  };
};

const useFetch = url => {
  const [data] = useState(
    () =>
      new Promise(resolve => {
        setTimeout(() => {
          resolve({
            url,
            name: Math.random()
              .toString(36)
              .slice(2)
          });
        }, 100);
      })
  );
  return createResource(data).read();
};

const AsyncFoo = id => {
  const foo = useFetch(`/foo/${id}`);
  return <div>{foo.name}</div>;
};

const Foo = () => {
  const [id] = useState(0);
  return <div className="foo">{id}</div>;
};

function App() {
  return (
    <div>
      <Foo />
      <Suspense fallback={<div>Loading...</div>}>
        <AsyncFoo>
          <Foo />
        </AsyncFoo>
        <AsyncFoo>
          <Foo />
        </AsyncFoo>
      </Suspense>
    </div>
  );
}

const execute = async () => {
  const html = await renderToStringAsync(<App />);
  console.log(prettier.format(html, { parser: 'html' }));
};

execute();

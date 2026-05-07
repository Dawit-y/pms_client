import React from 'react';
import { Col, FormControl } from 'react-bootstrap';

function DebouncedInput({
  value: initialValue,
  onChange,
  debounce = 500,
  globalFilter,
  ...props
}) {
  const [value, setValue] = React.useState(initialValue);

  const onChangeRef = React.useRef(onChange);
  const debounceRef = React.useRef(debounce);

  // Keep refs up to date
  React.useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  React.useEffect(() => {
    debounceRef.current = debounce;
  }, [debounce]);

  // Sync external value → local state
  React.useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  // Debounced effect (only depends on value)
  React.useEffect(() => {
    const timeout = setTimeout(() => {
      onChangeRef.current(value);
    }, debounceRef.current);

    return () => clearTimeout(timeout);
  }, [value]);

  return (
    <Col sm={globalFilter ? 4 : 12}>
      <FormControl
        size={globalFilter ? 'md' : 'sm'}
        {...props}
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
    </Col>
  );
}

export default DebouncedInput;

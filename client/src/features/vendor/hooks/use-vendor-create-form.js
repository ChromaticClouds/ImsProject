import { useMemo, useState } from 'react';

export const VENDOR_CREATE_FIELDS = {
  bossName: 'bossName',
  vendorName: 'vendorName',
  telephone: 'telephone',
  email: 'email',
  address: 'address',
  memo: 'memo',
};

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^(01[0-9]-\d{3,4}-\d{4}|0\d{1,2}-\d{3,4}-\d{4})$/;

function normalizePhone(value) {
  const digits = value.replace(/[^\d]/g, '');

  if (digits.startsWith('02')) {
    if (digits.length <= 2) return digits;
    if (digits.length <= 5) return `${digits.slice(0, 2)}-${digits.slice(2)}`;
    if (digits.length <= 9) {
      return `${digits.slice(0, 2)}-${digits.slice(2, 5)}-${digits.slice(5)}`;
    }
    return `${digits.slice(0, 2)}-${digits.slice(2, 6)}-${digits.slice(6, 10)}`;
  }

  if (digits.length <= 3) return digits;
  if (digits.length <= 7) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
  return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7, 11)}`;
}

const INITIAL_FORM = {
  type: 'Supplier',
  bossName: '',
  vendorName: '',
  telephone: '',
  email: '',
  address: '',
  memo: '',
};

const INITIAL_TOUCHED = {
  bossName: false,
  vendorName: false,
  telephone: false,
  email: false,
  address: false,
};

export function useVendorCreateForm() {
  const [form, setForm] = useState(INITIAL_FORM);
  const [touched, setTouched] = useState(INITIAL_TOUCHED);

  const setField = (key) => (e) => {
    let value = e.target.value;
    if (key === VENDOR_CREATE_FIELDS.telephone) value = normalizePhone(value);
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const setType = (type) => {
    setForm((prev) => ({ ...prev, type }));
  };

  const markTouched = (key) => () => {
    setTouched((prev) => ({ ...prev, [key]: true }));
  };

  const touchRequired = () => {
    setTouched({
      bossName: true,
      vendorName: true,
      telephone: true,
      email: true,
      address: true,
    });
  };

  const errors = useMemo(() => {
    const next = {};

    const bossName = form.bossName.trim();
    const vendorName = form.vendorName.trim();
    const telephone = form.telephone.trim();
    const email = form.email.trim();
    const address = form.address.trim();

    if (!bossName) next.bossName = '필수 입력값입니다.';
    else if (bossName.length < 2 || bossName.length > 10) {
      next.bossName = '대표자명은 2~10자만 허용됩니다.';
    }

    if (!vendorName) next.vendorName = '필수 입력값입니다.';

    if (!telephone) next.telephone = '필수 입력값입니다.';
    else if (!phoneRegex.test(telephone)) {
      next.telephone = '전화번호 형식이 올바르지 않습니다.';
    }

    if (!email) next.email = '필수 입력값입니다.';
    else if (!emailRegex.test(email)) {
      next.email = '이메일 형식이 올바르지 않습니다.';
    }

    if (!address) next.address = '필수 입력값입니다.';

    return next;
  }, [form]);

  const isValidRequired = useMemo(() => {
    return Object.values(errors).every((message) => !message);
  }, [errors]);

  return {
    form,
    touched,
    errors,
    isSupplier: form.type === 'Supplier',
    isValidRequired,
    setField,
    setType,
    markTouched,
    touchRequired,
  };
}


export const professionalTypeId = "dff730d3-8699-401d-aaed-ef696f6a54e6";
export const activeStatusId = "4e0c26b8-a0f2-4cd2-a671-34fd40d20db2";
export const inactiveStatusId = "60e4f494-3904-4122-881f-4ad3deb1cd56";
export const blockedStatusId = "008bb1da-c558-418e-a0c4-385be2675d9d";
export const pendingStatusId = "bd6ef141-3a52-4e98-9717-d8ba9e97a79e";

export function cnpj(n) {
  n = n.replace(/\D/g, "");
  n = n.replace(/^(\d{2})(\d)/, "$1.$2");
  n = n.replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3");
  n = n.replace(/\.(\d{3})(\d)/, ".$1/$2");
  n = n.replace(/(\d{4})(\d)/, "$1-$2");
  return n;
}

export function cpf(n) {
  n = n.replace(/\D/g, "");
  n = n.replace(/(\d{3})(\d)/, "$1.$2");
  n = n.replace(/(\d{3})(\d)/, "$1.$2");
  n = n.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
  return n;
}

export const phoneMask = (value) => {
  if (!value) return "";
  value = value.replace(/\D/g, "");
  value = value.replace(/(\d{2})(\d)/, "($1) $2");
  value = value.replace(/(\d)(\d{4})$/, "$1-$2");
  return value;
};

export const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    return regex.test(email);
  };


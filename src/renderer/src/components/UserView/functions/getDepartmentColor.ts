import styles from '../styles.module.scss';

export type departmentColor = {
    departmentName: string;
    styleName: string;
  };
  
  export type departmentColorList = departmentColor[];

const colorList: departmentColorList = [
    {
      departmentName: 'BS',
      styleName: styles.bs,
    },
    {
      departmentName: 'MS',
      styleName: styles.ms,
    },
    {
      departmentName: 'CS',
      styleName: styles.cs,
    },
    {
      departmentName: 'ES',
      styleName: styles.es,
    },
    {
      departmentName: 'HS',
      styleName: styles.hs,
    },
    {
      departmentName: 'DS',
      styleName: styles.ds,
    },
  ];

export const getDepartmentColor = (departmentName: string) => {
    const color = colorList.find((element) => element.departmentName === departmentName);
    if (!color) return styles.departmentdefault;
    return color?.styleName;
};

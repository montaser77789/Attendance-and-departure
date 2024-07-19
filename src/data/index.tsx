interface IloginInput {
    placeholder: string;
    name: "email" | "password";
    type: string;
    validation: {
      required?: string;
      minLength?: number;
      pattern?: RegExp;
    };
  }
export const data_login : IloginInput[] =[
    {
        placeholder:"البريد الالكتروني",
        name:"email",
        type:"email",
        validation:{
            required: "true",
            pattern: /^[^@]+@[^@'.]+\.[^@'.]{2,}$/ ,
        }
    },
    {
        placeholder:"كلمة المرور",
        name:"password",
        type:"password",
        validation:{
            required: "true"
            , minLength: 5
        }
    }
]

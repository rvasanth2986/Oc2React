import { CognitoUserPool } from 'amazon-cognito-identity-js';

// const poolData = {
//   UserPoolId: 'ap-south-1_V8t6suS17',
//   ClientId: '6m9ri5e57k1etgg8qt8fc22jhq'
// };
const poolData = {
  UserPoolId: 'us-east-2_84ciYusYS',
  ClientId: '1tb2oahp6h6l2tpsvnfldmi59r'
};
// const poolData = {
//   UserPoolId: 'ap-south-1_HXJUpzV0a',
//   ClientId: 'eq4l2mqvnmlfjliqakntmvabo'
// };

export default new CognitoUserPool(poolData);
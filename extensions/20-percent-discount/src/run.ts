// @ts-check
import { DiscountApplicationStrategy } from "../generated/api";

import type { RunInput, FunctionRunResult, Target, ProductVariant } from "../generated/api";


const EMPTY_DISCOUNT: FunctionRunResult = {
  discountApplicationStrategy: DiscountApplicationStrategy.First,
  discounts: [],
};


export function run(input: RunInput): FunctionRunResult {

  const targets: Target[] = input.cart.lines.filter(line => {
    if(line.merchandise.__typename === "ProductVariant"){
      const has20PercentOff = line.merchandise.product.hasAnyTag
      return has20PercentOff === true;
    }
  }).map((line) => {
    return {
      productVariant: {
        id: (line.merchandise as ProductVariant).id,
      },
    }
  })

  const DISCOUNTED_ITEMS: FunctionRunResult = {
    discountApplicationStrategy: DiscountApplicationStrategy.First,
    discounts: [
      {
        targets: targets,
        value: {
          percentage: {
            value: "20.0",
          }
        },
        message: "20% discount applied"
      }
    ]
     
  }

  return targets.length === 0 ? EMPTY_DISCOUNT : DISCOUNTED_ITEMS;
};
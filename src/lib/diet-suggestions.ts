
import { FitnessGoal } from "./store";

export interface FoodItem {
  name: string;
  description: string;
  benefits: string[];
}

export interface DietSuggestion {
  title: string;
  description: string;
  foods: FoodItem[];
}

export function getDietSuggestionsByGoal(goal: FitnessGoal): DietSuggestion {
  switch (goal) {
    case 'gain_muscle':
      return {
        title: 'High Protein Diet',
        description: 'Focus on protein-rich foods to support muscle growth and recovery.',
        foods: [
          {
            name: 'Lean Proteins',
            description: 'Chicken breast, turkey, lean beef, and eggs are excellent sources of complete proteins.',
            benefits: ['Muscle Growth', 'Recovery']
          },
          {
            name: 'Dairy & Alternatives',
            description: 'Greek yogurt, cottage cheese, and protein-fortified plant milks provide protein and calcium.',
            benefits: ['Protein', 'Calcium']
          },
          {
            name: 'Complex Carbs',
            description: 'Brown rice, quinoa, sweet potatoes, and oats provide energy for intense workouts.',
            benefits: ['Energy', 'Fiber']
          },
          {
            name: 'Healthy Fats',
            description: 'Avocados, nuts, olive oil, and fatty fish contain essential fatty acids.',
            benefits: ['Recovery', 'Hormones']
          }
        ]
      };
      
    case 'lose_fat':
      return {
        title: 'Calorie-Controlled Diet',
        description: 'Focus on nutrient-dense, low-calorie foods that keep you full longer.',
        foods: [
          {
            name: 'Lean Proteins',
            description: 'Fish, chicken breast, tofu, and legumes provide protein with fewer calories.',
            benefits: ['Satiety', 'Muscle Preservation']
          },
          {
            name: 'Non-Starchy Vegetables',
            description: 'Leafy greens, broccoli, cauliflower, and bell peppers are high in volume, low in calories.',
            benefits: ['Low Calorie', 'Nutrients']
          },
          {
            name: 'Fiber-Rich Foods',
            description: 'Berries, apples, and chia seeds provide fiber that helps you feel full.',
            benefits: ['Satiety', 'Digestion']
          },
          {
            name: 'Hydrating Foods',
            description: 'Cucumber, watermelon, and celery have high water content and few calories.',
            benefits: ['Hydration', 'Low Calorie']
          }
        ]
      };
      
    case 'stay_fit':
    default:
      return {
        title: 'Balanced Diet',
        description: 'Focus on a well-rounded diet with plenty of whole foods and balanced macronutrients.',
        foods: [
          {
            name: 'Varied Proteins',
            description: 'Mix of animal and plant proteins like fish, poultry, beans, and lentils.',
            benefits: ['Complete Nutrition', 'Sustainability']
          },
          {
            name: 'Colorful Vegetables',
            description: 'Aim for a variety of colors to get different phytonutrients and antioxidants.',
            benefits: ['Antioxidants', 'Vitamins']
          },
          {
            name: 'Whole Grains',
            description: 'Whole wheat, barley, and oats provide sustained energy and essential nutrients.',
            benefits: ['Fiber', 'B Vitamins']
          },
          {
            name: 'Healthy Fats',
            description: 'Olive oil, nuts, seeds, and avocados support overall health.',
            benefits: ['Heart Health', 'Satiety']
          }
        ]
      };
  }
}
